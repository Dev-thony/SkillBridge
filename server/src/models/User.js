import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    links: {
      portfolio: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      x: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    avatarUrl: { type: String, default: "" },
    contact: {
      phone: { type: String, default: "", maxlength: 30 },
      location: { type: String, default: "", maxlength: 120 },
      website: { type: String, default: "", maxlength: 500 },
    },
    resumeUrl: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    profileType: {
      type: String,
      enum: [
        "developer",
        "designer",
        "company",
        "student",
        "freelancer",
        "other",
      ],
      default: "developer",
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model("User", userSchema);
