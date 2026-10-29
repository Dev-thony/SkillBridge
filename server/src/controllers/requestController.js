import mongoose from "mongoose";
import Project from "../models/Project.js";
import JoinRequest from "../models/JoinRequest.js";

function isOwner(project, user) { return project.owner.toString() === user._id.toString(); }

export async function createRequest(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Project identifier is invalid." } });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project was not found." } });
    if (isOwner(project, req.user)) return res.status(409).json({ error: { code: "CONFLICT", message: "You cannot request to join your own project." } });
    if (project.status !== "open") return res.status(409).json({ error: { code: "CONFLICT", message: "This project is not accepting requests." } });
    if (project.members.some((member) => member.toString() === req.user._id.toString())) return res.status(409).json({ error: { code: "CONFLICT", message: "You are already a member of this project." } });

    const existing = await JoinRequest.findOne({ project: project._id, applicant: req.user._id, status: "pending" });
    if (existing) return res.status(409).json({ error: { code: "CONFLICT", message: "You already have a pending request for this project." } });

    const message = req.body?.message;
    if (message !== undefined && (typeof message !== "string" || message.length > 1000)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request message must be text with at most 1000 characters." } });

    const request = await JoinRequest.create({ project: project._id, applicant: req.user._id, message: typeof message === "string" ? message.trim() : "", matchedSkills: req.body?.matchedSkills?.filter?.((skill) => typeof skill === "string") || [] });
    res.status(201).json({ data: { request }, message: "Join request submitted successfully." });
  } catch (error) { next(error); }
}

export async function listProjectRequests(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Project identifier is invalid." } });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project was not found." } });
    if (!isOwner(project, req.user)) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Only the project owner can view join requests." } });

    const requests = await JoinRequest.find({ project: project._id }).populate("applicant", "name email title skills avatarUrl").sort({ createdAt: -1 });
    res.status(200).json({ data: { requests } });
  } catch (error) { next(error); }
}

export async function reviewRequest(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.requestId)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request identifier is invalid." } });
    const status = req.body?.status;
    if (!["approved", "declined"].includes(status)) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Status must be approved or declined." } });

    const request = await JoinRequest.findById(req.params.requestId).populate("project applicant", "owner members memberLimit status name email title skills avatarUrl");
    if (!request) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Join request was not found." } });
    if (request.status !== "pending") return res.status(409).json({ error: { code: "CONFLICT", message: "This join request has already been reviewed." } });

    const project = await Project.findById(request.project._id);
    if (!project) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Project was not found." } });
    if (!isOwner(project, req.user)) return res.status(403).json({ error: { code: "FORBIDDEN", message: "Only the project owner can review requests." } });

    if (status === "approved") {
      if (project.status === "closed") return res.status(409).json({ error: { code: "CONFLICT", message: "A closed project cannot accept members." } });
      if (project.members.length >= project.memberLimit) return res.status(409).json({ error: { code: "CONFLICT", message: "The project is full." } });

      const updatedProject = await Project.findOneAndUpdate(
        { _id: project._id, status: { $ne: "closed" }, members: { $nin: [request.applicant._id] }, $expr: { $lt: [{ $size: "$members" }, "$memberLimit"] } },
        { $addToSet: { members: request.applicant._id }, $set: { status: project.members.length + 1 >= project.memberLimit ? "full" : "open" } },
        { new: true },
      );
      if (!updatedProject) return res.status(409).json({ error: { code: "CONFLICT", message: "The project capacity changed or the applicant is already a member." } });
    }

    const reviewed = await JoinRequest.findOneAndUpdate(
      { _id: request._id, status: "pending" },
      { $set: { status, reviewedAt: new Date() } },
      { new: true },
    );
    if (!reviewed) return res.status(409).json({ error: { code: "CONFLICT", message: "This join request has already been reviewed." } });

    res.status(200).json({ data: { request: reviewed }, message: `Join request ${status}.` });
  } catch (error) { next(error); }
}
