import express from "express";
import { reviewRequest } from "../controllers/requestController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.patch("/:requestId", requireAuth, reviewRequest);
export default router;
