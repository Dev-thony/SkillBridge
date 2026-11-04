import express from "express";
import {
  getOwnRequests,
  getPublicUser,
  updateOwnProfile,
  deleteMyAccount,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me/requests", requireAuth, getOwnRequests);
router.patch("/me", requireAuth, updateOwnProfile);
router.delete("/me", requireAuth, deleteMyAccount);
router.get("/:id", requireAuth, getPublicUser);

export default router;
