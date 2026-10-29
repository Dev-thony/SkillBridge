import express from "express";
import { createProject, deleteProject, getProject, listProjects, updateProject } from "../controllers/projectController.js";
import { createRequest, listProjectRequests } from "../controllers/requestController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", listProjects);
router.post("/", requireAuth, createProject);
router.get("/:id", getProject);
router.patch("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);
router.post("/:id/requests", requireAuth, createRequest);
router.get("/:id/requests", requireAuth, listProjectRequests);
export default router;
