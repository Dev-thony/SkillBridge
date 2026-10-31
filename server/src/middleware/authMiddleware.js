import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { COOKIE_NAME } from "../utils/authTokens.js";

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    const cookieToken = req.cookies?.[COOKIE_NAME];

    const token = bearerToken || cookieToken;

    if (!token) {
      console.warn("[Auth] No session token received.", {
        path: req.originalUrl,
        cookieParserAvailable: Boolean(req.cookies),
        cookieNames: Object.keys(req.cookies || {}),
        hasAuthorizationHeader: Boolean(authorization),
      });

      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required. Please log in again.",
        },
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[Auth] JWT_SECRET is not configured.");

      return res.status(500).json({
        error: {
          code: "SERVER_ERROR",
          message: "Authentication configuration is missing.",
        },
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    const user = await User.findById(payload.sub);

    if (!user) {
      console.warn("[Auth] Token is valid but the user was not found.");

      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "The associated user no longer exists. Please log in again.",
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[Auth] Authentication failed:", error.message);

    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Your session is invalid or expired. Please log in again.",
      },
    });
  }
}
