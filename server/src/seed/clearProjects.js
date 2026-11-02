import "dotenv/config";
import mongoose from "mongoose";

import Project from "../models/Project.js";
import JoinRequest from "../models/JoinRequest.js";

async function clearProjects() {
  if (process.env.CONFIRM_PROJECT_RESET !== "true") {
    throw new Error(
      "Reset blocked. Set CONFIRM_PROJECT_RESET=true to confirm.",
    );
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from your environment.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connected to MongoDB.");

  const requestCount = await JoinRequest.countDocuments();
  const projectCount = await Project.countDocuments();

  console.log(`Projects to delete: ${projectCount}`);
  console.log(`Join requests to delete: ${requestCount}`);

  const requestsResult = await JoinRequest.deleteMany({});
  const projectsResult = await Project.deleteMany({});

  console.log(`Deleted join requests: ${requestsResult.deletedCount}`);
  console.log(`Deleted projects: ${projectsResult.deletedCount}`);
  console.log("Registered user accounts were not changed.");

  await mongoose.disconnect();
}

clearProjects().catch(async (error) => {
  console.error("Project cleanup failed:", error);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  process.exitCode = 1;
});
