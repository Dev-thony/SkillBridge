import express from "express";

import {
  createProject,
  closeProject,
  deleteProject,
  getProject,
  listOwnProjects,
  listProjects,
  updateProject,
  removeProjectMember,
} from "../controllers/projectController.js";

import {
  createRequest,
  listProjectRequests,
} from "../controllers/requestController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public project discovery.
router.get("/", listProjects);

// Authenticated user's own projects.
// This route must be registered before router.get("/:id").
router.get("/mine", requireAuth, listOwnProjects);

// Project creation.
router.post("/", requireAuth, createProject);

// Project details and owner actions.
router.get("/:id", getProject);
router.patch("/:id", requireAuth, updateProject);
router.delete("/:id/members/:memberId", requireAuth, removeProjectMember);
router.patch("/:id/close", requireAuth, closeProject);
router.delete("/:id", requireAuth, deleteProject);

// Join requests.
router.post("/:id/requests", requireAuth, createRequest);
router.get("/:id/requests", requireAuth, listProjectRequests);

export default router;
