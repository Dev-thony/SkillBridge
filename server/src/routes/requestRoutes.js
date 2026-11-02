import express from "express";

import {
  reviewRequest,
  withdrawRequest,
} from "../controllers/requestController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.patch("/:requestId", requireAuth, reviewRequest);
router.patch("/:requestId/withdraw", requireAuth, withdrawRequest);


export default router;
