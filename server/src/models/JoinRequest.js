import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: { type: String, trim: true, maxlength: 1000, default: "" },
    matchedSkills: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "withdrawn"],
      default: "pending",
      index: true,
    },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

joinRequestSchema.index(
  { project: 1, applicant: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

export default mongoose.model("JoinRequest", joinRequestSchema);
