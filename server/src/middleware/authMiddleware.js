import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { COOKIE_NAME } from "../utils/authTokens.js";

function getCookieValue(header, name) {
  if (!header) return undefined;
  const cookie = header.split(";").find((item) => item.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.trim().slice(name.length + 1)) : undefined;
}

export function requireAuth(req, res, next) {
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = headerToken || getCookieValue(req.headers.cookie, COOKIE_NAME);

  if (!token) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Authentication is required." } });
  if (!process.env.JWT_SECRET) return next(new Error("JWT_SECRET is not configured"));

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] }, async (error, payload) => {
    if (error || !payload?.sub) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Your session is invalid or has expired." } });
    }

    try {
      const user = await User.findById(payload.sub);
      if (!user) return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Your session is invalid." } });
      req.user = user;
      next();
    } catch (verificationError) {
      next(verificationError);
    }
  });
}
