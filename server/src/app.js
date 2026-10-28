import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SkillBridge API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

export default app;
