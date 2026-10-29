import express from "express";
import { getOwnRequests, getPublicUser, updateOwnProfile } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/me/requests", requireAuth, getOwnRequests);
router.patch("/me", requireAuth, updateOwnProfile);
router.get("/:id", getPublicUser);
export default router;
