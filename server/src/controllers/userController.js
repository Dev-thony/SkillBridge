import mongoose from "mongoose";
import User from "../models/User.js";
import JoinRequest from "../models/JoinRequest.js";
import { publicUser } from "./authController.js";

export async function getPublicUser(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "User identifier is invalid." } });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: { code: "NOT_FOUND", message: "User was not found." } });
    res.status(200).json({ data: { user: publicUser(user) } });
  } catch (error) { next(error); }
}

export async function updateOwnProfile(req, res, next) {
  try {
    const allowed = ["name", "bio", "title", "skills", "interests", "links", "avatarUrl", "profileCompleted"];
    const updates = {};
    for (const key of allowed) if (Object.prototype.hasOwnProperty.call(req.body ?? {}, key)) updates[key] = req.body[key];

    if (updates.name !== undefined) {
      if (typeof updates.name !== "string" || updates.name.trim().length < 2 || updates.name.trim().length > 80) {
        return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Name must contain between 2 and 80 characters." } });
      }
      updates.name = updates.name.trim();
    }
    if (updates.bio !== undefined && (typeof updates.bio !== "string" || updates.bio.length > 500)) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Bio must be text with at most 500 characters." } });
    }
    if (["skills", "interests"].some((key) => updates[key] !== undefined && !Array.isArray(updates[key]))) {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Skills and interests must be arrays." } });
    }
    if (updates.links !== undefined && typeof updates.links !== "object") {
      return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Links must be an object." } });
    }

    Object.assign(req.user, updates);
    await req.user.save();
    res.status(200).json({ data: { user: publicUser(req.user) }, message: "Profile updated successfully." });
  } catch (error) { next(error); }
}

export async function getOwnRequests(req, res, next) {
  try {
    const requests = await JoinRequest.find({ applicant: req.user._id })
      .populate("project", "title shortDescription status owner memberLimit")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: { requests } });
  } catch (error) { next(error); }
}
