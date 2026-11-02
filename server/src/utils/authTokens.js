import jwt from "jsonwebtoken";

export const COOKIE_NAME = "skillbridge_session";

export function createAuthToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
}

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  };
}

export function getClearedCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };
}