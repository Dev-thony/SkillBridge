import User from "../models/User.js";
import {
  COOKIE_NAME,
  createAuthToken,
  getCookieOptions,
} from "../utils/authTokens.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    skills: user.skills,
    interests: user.interests,
    profileCompleted: user.profileCompleted,
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        message: "Name must contain between 2 and 80 characters.",
      });
    }

    if (cleanEmail.length > 254 || !emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    if (password.length < 12 || password.length > 128) {
      return res.status(400).json({
        message: "Password must contain between 12 and 128 characters.",
      });
    }

    const existingUser = await User.exists({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
    });

    const token = createAuthToken(user._id);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    next(error);
  }
}
