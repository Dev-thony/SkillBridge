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
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Profile data must be a JSON object.",
        },
      });
    }

    const allowed = [
      "name",
      "bio",
      "title",
      "skills",
      "interests",
      "links",
      "avatarUrl",
      "profileCompleted",
    ];

    const updates = {};

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updates[key] = body[key];
      }
    }

    if (updates.name !== undefined) {
      if (
        typeof updates.name !== "string" ||
        updates.name.trim().length < 2 ||
        updates.name.trim().length > 80
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Name must contain between 2 and 80 characters.",
          },
        });
      }

      updates.name = updates.name.trim();
    }

    if (updates.bio !== undefined) {
      if (typeof updates.bio !== "string" || updates.bio.length > 500) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Bio must be text with at most 500 characters.",
          },
        });
      }

      updates.bio = updates.bio.trim();
    }

    if (updates.title !== undefined) {
      if (
        typeof updates.title !== "string" ||
        updates.title.trim().length > 100
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Title must be text with at most 100 characters.",
          },
        });
      }

      updates.title = updates.title.trim();
    }

    for (const field of ["skills", "interests"]) {
      if (updates[field] === undefined) continue;

      if (
        !Array.isArray(updates[field]) ||
        updates[field].length > 50 ||
        !updates[field].every(
          (item) =>
            typeof item === "string" &&
            item.trim().length > 0 &&
            item.trim().length <= 50,
        )
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: `${field} must be an array of up to 50 non-empty strings, each no longer than 50 characters.`,
          },
        });
      }

      updates[field] = [...new Set(updates[field].map((item) => item.trim()))];
    }

    if (updates.links !== undefined) {
      const allowedLinkKeys = ["portfolio", "github", "linkedin", "x"];

      if (
        !updates.links ||
        typeof updates.links !== "object" ||
        Array.isArray(updates.links)
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Links must be an object.",
          },
        });
      }

      const links = {
        ...req.user.links?.toObject?.(),
        ...req.user.links,
        ...updates.links,
      };

      for (const key of Object.keys(updates.links)) {
        if (!allowedLinkKeys.includes(key)) {
          return res.status(400).json({
            error: {
              code: "VALIDATION_ERROR",
              message: `Unsupported profile link: ${key}.`,
            },
          });
        }
      }

      for (const key of allowedLinkKeys) {
        if (updates.links[key] === undefined) continue;

        const value = updates.links[key];

        if (typeof value !== "string" || value.length > 500) {
          return res.status(400).json({
            error: {
              code: "VALIDATION_ERROR",
              message: `The ${key} link must be a string no longer than 500 characters.`,
            },
          });
        }

        const trimmed = value.trim();

        if (trimmed) {
          try {
            const parsed = new URL(trimmed);

            if (!["http:", "https:"].includes(parsed.protocol)) {
              throw new Error("Unsupported URL protocol.");
            }
          } catch {
            return res.status(400).json({
              error: {
                code: "VALIDATION_ERROR",
                message: `The ${key} link must be a valid HTTP or HTTPS URL.`,
              },
            });
          }
        }

        links[key] = trimmed;
      }

      updates.links = links;
    }

    if (updates.avatarUrl !== undefined) {
      if (
        typeof updates.avatarUrl !== "string" ||
        updates.avatarUrl.length > 1000
      ) {
        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message:
              "Avatar URL must be a string no longer than 1000 characters.",
          },
        });
      }

      const avatarUrl = updates.avatarUrl.trim();

      if (avatarUrl) {
        try {
          const parsed = new URL(avatarUrl);

          if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Unsupported URL protocol.");
          }
        } catch {
          return res.status(400).json({
            error: {
              code: "VALIDATION_ERROR",
              message: "Avatar URL must be a valid HTTP or HTTPS URL.",
            },
          });
        }
      }

      updates.avatarUrl = avatarUrl;
    }

    if (
      updates.profileCompleted !== undefined &&
      typeof updates.profileCompleted !== "boolean"
    ) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "profileCompleted must be a boolean.",
        },
      });
    }

    Object.assign(req.user, updates);

    await req.user.save();

    return res.status(200).json({
      data: {
        user: publicUser(req.user),
      },
      message: "Profile updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function getOwnRequests(req, res, next) {
  try {
    const requests = await JoinRequest.find({ applicant: req.user._id })
      .populate("project", "title shortDescription status owner memberLimit")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: { requests } });
  } catch (error) { next(error); }
}
