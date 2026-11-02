import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 240,
    },
    description: { type: String, trim: true, maxlength: 5000, default: "" },
    goals: {
      type: [{ type: String, trim: true, maxlength: 200 }],
      default: [],
    },
    techStack: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
    },
    rolesNeeded: [
      {
        role: { type: String, trim: true, maxlength: 80, required: true },
        skills: {
          type: [{ type: String, trim: true, maxlength: 50 }],
          default: [],
        },
        slots: { type: Number, min: 1, max: 50, default: 1 },
        filled: { type: Number, min: 0, default: 0 },
      },
    ],
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    memberLimit: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
      default: 10,
    },
    status: {
      type: String,
      enum: ["open", "full", "closed"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true },
);

projectSchema.index({
  title: "text",
  shortDescription: "text",
  techStack: "text",
});

export default mongoose.model("Project", projectSchema);
