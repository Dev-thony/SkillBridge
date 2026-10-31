import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  COOKIE_NAME,
  createAuthToken,
  getClearedCookieOptions,
  getCookieOptions,
} from "../utils/authTokens.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    title: user.title,
    skills: user.skills,
    interests: user.interests,
    links: user.links,
    avatarUrl: user.avatarUrl,
    profileCompleted: user.profileCompleted,
  };
}

function validationError(res, message) {
  return res.status(400).json({ error: { code: "VALIDATION_ERROR", message } });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {};
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return validationError(res, "Name, email, and password are required.");
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2 || cleanName.length > 80)
      return validationError(
        res,
        "Name must contain between 2 and 80 characters.",
      );
    if (cleanEmail.length > 254 || !emailPattern.test(cleanEmail))
      return validationError(res, "Enter a valid email address.");
    if (password.length < 12 || password.length > 128)
      return validationError(
        res,
        "Password must contain between 12 and 128 characters.",
      );

    if (await User.exists({ email: cleanEmail })) {
      return res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "An account with this email already exists.",
          },
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
      data: {
        user: publicUser(user),
      },
      message: "Account created successfully.",
    });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "An account with this email already exists.",
          },
        });
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string")
      return validationError(res, "Email and password are required.");

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Email or password is incorrect.",
          },
        });
    }

    const token = createAuthToken(user._id);
    
    res.cookie(COOKIE_NAME, token, getCookieOptions());
    return res.status(200).json({
      data: {
        user: publicUser(user),
      },
      message: "Signed in successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.status(200).json({ data: { user: publicUser(req.user) } });
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, getClearedCookieOptions());
  
  return res.status(200).json({ 
    data: {}, 
    message: "Signed out successfully." 
  });
}
