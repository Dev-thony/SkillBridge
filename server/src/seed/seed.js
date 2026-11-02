import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

const DEMO_PASSWORD = "SkillBridgeDemo123!";

const demoUsers = [
  {
    name: "Amara Okafor",
    email: "amara.demo@skillbridge.test",
    password: DEMO_PASSWORD,
    bio: "Frontend developer interested in building accessible web applications.",
    title: "Frontend Developer",
    skills: ["JavaScript", "React", "CSS"],
    interests: ["Web Development", "Open Source"],
    profileCompleted: true,
  },
  {
    name: "Daniel Adeyemi",
    email: "daniel.demo@skillbridge.test",
    password: DEMO_PASSWORD,
    bio: "Backend developer interested in APIs and scalable applications.",
    title: "Backend Developer",
    skills: ["Node.js", "Express", "MongoDB"],
    interests: ["Backend Development", "Cloud Computing"],
    profileCompleted: true,
  },
  {
    name: "Zara Ibrahim",
    email: "zara.demo@skillbridge.test",
    password: DEMO_PASSWORD,
    bio: "UI/UX designer who enjoys collaborating with developers.",
    title: "UI/UX Designer",
    skills: ["Figma", "UI Design", "Prototyping"],
    interests: ["Product Design", "Design Systems"],
    profileCompleted: true,
  },
];

const demoProjects = [
  {
    ownerEmail: "amara.demo@skillbridge.test",
    title: "Community Learning Platform",
    shortDescription:
      "Build a platform where learners can share knowledge and study together.",
    description:
      "A collaborative learning platform with user profiles, learning resources, and community discussions.",
    goals: [
      "Create accessible learning experiences",
      "Support collaborative learning",
      "Build reusable interface components",
    ],
    techStack: ["React", "JavaScript", "CSS", "Node.js"],
    rolesNeeded: [
      {
        role: "Backend Developer",
        skills: ["Node.js", "Express", "MongoDB"],
        slots: 2,
        filled: 0,
      },
      {
        role: "UI/UX Designer",
        skills: ["Figma", "Prototyping"],
        slots: 1,
        filled: 0,
      },
    ],
    memberLimit: 5,
    status: "open",
  },
  {
    ownerEmail: "daniel.demo@skillbridge.test",
    title: "Developer Collaboration Hub",
    shortDescription:
      "Create a hub that helps developers discover projects and collaborate.",
    description:
      "A full-stack application where developers can publish projects, find collaborators, and track team opportunities.",
    goals: [
      "Help developers find teammates",
      "Make project discovery easier",
      "Encourage practical collaboration",
    ],
    techStack: ["React", "Express", "MongoDB", "Node.js"],
    rolesNeeded: [
      {
        role: "Frontend Developer",
        skills: ["React", "JavaScript"],
        slots: 2,
        filled: 0,
      },
      {
        role: "UI/UX Designer",
        skills: ["Figma", "UI Design"],
        slots: 1,
        filled: 0,
      },
    ],
    memberLimit: 6,
    status: "open",
  },
];

async function seedDatabase() {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Seed script is disabled in production to protect real data.",
    );
  }

  await connectDB();

  const usersByEmail = new Map();

  for (const userData of demoUsers) {
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = await User.create(userData);
      console.log(`Created demo user: ${user.email}`);
    } else {
      console.log(`Demo user already exists: ${user.email}`);
    }

    usersByEmail.set(userData.email, user);
  }

  for (const projectData of demoProjects) {
    const owner = usersByEmail.get(projectData.ownerEmail);

    if (!owner) {
      throw new Error(
        `Could not find demo project owner: ${projectData.ownerEmail}`,
      );
    }

    const existingProject = await Project.findOne({
      owner: owner._id,
      title: projectData.title,
    });

    if (existingProject) {
      console.log(`Project already exists: ${projectData.title}`);
      continue;
    }

    const { ownerEmail, ...projectFields } = projectData;

    await Project.create({
      ...projectFields,
      owner: owner._id,
    });

    console.log(`Created demo project: ${projectData.title}`);
  }

  console.log("Database seeding completed successfully.");
}

try {
  await seedDatabase();
} catch (error) {
  console.error("Database seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
