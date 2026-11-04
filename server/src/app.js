import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

const app = express();
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include curl and server-to-server
      // requests. Browser requests are checked against the allowlist.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
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
  res.status(200).json({ status: "ok" });
});

// Ensure MongoDB is connected before handling API requests.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database unavailable:", error.message);

    const databaseError = new Error("Database unavailable.");
    databaseError.status = 503;
    databaseError.code = "DATABASE_UNAVAILABLE";

    next(databaseError);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/requests", requestRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
