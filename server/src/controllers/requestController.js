import mongoose from "mongoose";
import Project from "../models/Project.js";
import JoinRequest from "../models/JoinRequest.js";

function isOwner(project, user) {
  return project.owner.toString() === user._id.toString();
}

export async function createRequest(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Project identifier is invalid.",
          },
        });
    const project = await Project.findById(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({
          error: { code: "NOT_FOUND", message: "Project was not found." },
        });
    if (isOwner(project, req.user))
      return res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "You cannot request to join your own project.",
          },
        });
    if (project.status !== "open")
      return res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "This project is not accepting requests.",
          },
        });
    if (
      project.members.some(
        (member) => member.toString() === req.user._id.toString(),
      )
    )
      return res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "You are already a member of this project.",
          },
        });

    const existing = await JoinRequest.findOne({
      project: project._id,
      applicant: req.user._id,
      status: "pending",
    });
    if (existing)
      return res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "You already have a pending request for this project.",
          },
        });

    const message = req.body?.message;
    if (
      message !== undefined &&
      (typeof message !== "string" || message.length > 1000)
    )
      return res
        .status(400)
        .json({
          error: {
            code: "VALIDATION_ERROR",
            message:
              "Request message must be text with at most 1000 characters.",
          },
        });

    const request = await JoinRequest.create({
      project: project._id,
      applicant: req.user._id,
      message: typeof message === "string" ? message.trim() : "",
      matchedSkills:
        req.body?.matchedSkills?.filter?.(
          (skill) => typeof skill === "string",
        ) || [],
    });
    res
      .status(201)
      .json({
        data: { request },
        message: "Join request submitted successfully.",
      });
  } catch (error) {
    next(error);
  }
}

export async function listProjectRequests(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Project identifier is invalid.",
          },
        });
    const project = await Project.findById(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({
          error: { code: "NOT_FOUND", message: "Project was not found." },
        });
    if (!isOwner(project, req.user))
      return res
        .status(403)
        .json({
          error: {
            code: "FORBIDDEN",
            message: "Only the project owner can view join requests.",
          },
        });

    const requests = await JoinRequest.find({ project: project._id })
      .populate("applicant", "name email title skills avatarUrl")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: { requests } });
  } catch (error) {
    next(error);
  }
}

export async function reviewRequest(req, res, next) {
  const { requestId } = req.params;
  const { status } = req.body || {};

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request identifier.",
      },
    });
  }

  if (!["approved", "declined"].includes(status)) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Status must be approved or declined.",
      },
    });
  }

  const session = await mongoose.startSession();

  try {
    let reviewedRequest;

    await session.withTransaction(async () => {
      const request = await JoinRequest.findById(requestId).session(session);

      if (!request) {
        const error = new Error("Join request not found.");
        error.status = 404;
        throw error;
      }

      if (request.status !== "pending") {
        const error = new Error("This request has already been reviewed.");
        error.status = 409;
        throw error;
      }

      const project = await Project.findById(request.project).session(session);

      if (!project) {
        const error = new Error("Project not found.");
        error.status = 404;
        throw error;
      }

      if (project.owner.toString() !== req.user._id.toString()) {
        const error = new Error("Only the project owner can review requests.");
        error.status = 403;
        throw error;
      }

      if (status === "approved") {
        if (project.status !== "open") {
          const error = new Error("This project is not accepting members.");
          error.status = 409;
          throw error;
        }

        const alreadyMember = project.members.some(
          (member) => member.toString() === request.applicant.toString(),
        );

        if (alreadyMember) {
          const error = new Error("Applicant is already a project member.");
          error.status = 409;
          throw error;
        }

        if (project.members.length >= project.memberLimit) {
          const error = new Error("Project is full.");
          error.status = 409;
          throw error;
        }

        project.members.push(request.applicant);

        if (project.members.length >= project.memberLimit) {
          project.status = "full";
        }

        await project.save({ session });
      }

      request.status = status;
      request.reviewedAt = new Date();

      await request.save({ session });

      reviewedRequest = request;
    });

    return res.status(200).json({
      data: {
        request: reviewedRequest,
      },
      message: `Join request ${status}.`,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code:
            error.status === 403
              ? "FORBIDDEN"
              : error.status === 404
                ? "NOT_FOUND"
                : "CONFLICT",
          message: error.message,
        },
      });
    }

    return next(error);
  } finally {
    await session.endSession();
  }
}
