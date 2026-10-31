import mongoose from "mongoose";
import Project from "../models/Project.js";

function ownerOnly(project, user) {
  return project.owner.toString() === user._id.toString();
}

function validateProjectBody(body, partial = false) {
  const allowed = [
    "title",
    "shortDescription",
    "description",
    "goals",
    "techStack",
    "rolesNeeded",
    "memberLimit",
  ];
  const updates = {};
  for (const key of allowed)
    if (Object.prototype.hasOwnProperty.call(body ?? {}, key))
      updates[key] = body[key];

  if (!partial && (!updates.title || !updates.shortDescription))
    return "Title and short description are required.";
  if (
    updates.title !== undefined &&
    (typeof updates.title !== "string" ||
      updates.title.trim().length < 3 ||
      updates.title.trim().length > 100)
  )
    return "Title must contain between 3 and 100 characters.";
  if (
    updates.shortDescription !== undefined &&
    (typeof updates.shortDescription !== "string" ||
      updates.shortDescription.trim().length < 10 ||
      updates.shortDescription.trim().length > 240)
  )
    return "Short description must contain between 10 and 240 characters.";
  if (
    ["goals", "techStack"].some(
      (key) => updates[key] !== undefined && !Array.isArray(updates[key]),
    )
  )
    return "Goals and tech stack must be arrays.";
  if (updates.rolesNeeded !== undefined && !Array.isArray(updates.rolesNeeded))
    return "Roles needed must be an array.";
  if (
    updates.memberLimit !== undefined &&
    (!Number.isInteger(updates.memberLimit) ||
      updates.memberLimit < 1 ||
      updates.memberLimit > 100)
  )
    return "Member limit must be an integer between 1 and 100.";

  if (updates.rolesNeeded) {
    for (const role of updates.rolesNeeded) {
      if (!role || typeof role !== "object" || Array.isArray(role)) {
        return "Each required role must be an object.";
      }

      const slots = role.slots ?? 1;

      if (
        typeof role.role !== "string" ||
        !role.role.trim() ||
        role.role.trim().length > 80 ||
        !Number.isInteger(slots) ||
        slots < 1 ||
        slots > 50
      ) {
        return "Each role needs a valid role name and slot count.";
      }

      if (
        role.skills !== undefined &&
        (!Array.isArray(role.skills) ||
          !role.skills.every(
            (skill) =>
              typeof skill === "string" &&
              skill.trim().length > 0 &&
              skill.trim().length <= 50,
          ))
      ) {
        return "Role skills must be an array of valid strings.";
      }
    }
  }
  return updates;
}

export async function listProjects(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = 20;
    const query = {};
    if (
      req.query.status &&
      ["open", "full", "closed"].includes(req.query.status)
    )
      query.status = req.query.status;
    if (typeof req.query.skill === "string" && req.query.skill.trim()) {
      const escapedSkill = req.query.skill
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.techStack = {
        $regex: escapedSkill,
        $options: "i",
      };
    }
    if (req.query.search) {
      const escaped = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { shortDescription: { $regex: escaped, $options: "i" } },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate("owner", "name title avatarUrl")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Project.countDocuments(query),
    ]);
    res
      .status(200)
      .json({
        data: {
          projects,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        },
      });
  } catch (error) {
    next(error);
  }
}

export async function listOwnProjects(req, res, next) {
  try {
    const projects = await Project.find({
      owner: req.user._id,
    })
      .populate("owner", "name title avatarUrl")
      .populate("members", "name title avatarUrl")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const result = validateProjectBody(req.body);
    if (typeof result === "string")
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: result } });

    result.owner = req.user._id;
    result.members = [req.user._id];
    if (result.memberLimit === undefined) result.memberLimit = 10;
    result.status = result.memberLimit <= 1 ? "full" : "open";
    const project = await Project.create(result);
    res
      .status(201)
      .json({ data: { project }, message: "Project created successfully." });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
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
    const project = await Project.findById(req.params.id)
      .populate("owner", "name title avatarUrl")
      .populate("members", "name title avatarUrl");
    if (!project)
      return res
        .status(404)
        .json({
          error: { code: "NOT_FOUND", message: "Project was not found." },
        });
    res.status(200).json({ data: { project } });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
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
    if (!ownerOnly(project, req.user))
      return res
        .status(403)
        .json({
          error: {
            code: "FORBIDDEN",
            message: "Only the project owner can update this project.",
          },
        });

    const result = validateProjectBody(req.body, true);
    if (typeof result === "string")
      return res
        .status(400)
        .json({ error: { code: "VALIDATION_ERROR", message: result } });
    if (
      result.memberLimit !== undefined &&
      result.memberLimit < project.members.length
    )
      return res
        .status(400)
        .json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Member limit cannot be below the current member count.",
          },
        });

    Object.assign(project, result);
    project.status =
      project.members.length >= project.memberLimit
        ? "full"
        : project.status === "closed"
          ? "closed"
          : "open";
    await project.save();
    res
      .status(200)
      .json({ data: { project }, message: "Project updated successfully." });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
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
    if (!ownerOnly(project, req.user))
      return res
        .status(403)
        .json({
          error: {
            code: "FORBIDDEN",
            message: "Only the project owner can close this project.",
          },
        });
    project.status = "closed";
    await project.save();
    res
      .status(200)
      .json({ data: { project }, message: "Project closed successfully." });
  } catch (error) {
    next(error);
  }
}
