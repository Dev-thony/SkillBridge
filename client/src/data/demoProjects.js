// Demonstration data only.
// Replace this with API responses when the backend is ready.

export const DEMO_PROJECTS = [
  {
    id: "demo-1",
    title: "Campus Study Planner",
    summary:
      "A collaborative study-planning app for students to organize courses, deadlines and group sessions.",
    description:
      "Campus Study Planner helps students manage their academic schedules, track assignments, and coordinate group study sessions. The goal is to create a simple, accessible workspace that makes collaborative studying easier.",
    status: "Open",
    category: "Education",
    rolesNeeded: ["Frontend Developer", "UI/UX Designer"],
    technologies: ["React", "JavaScript", "CSS"],
    memberCount: 2,
    teamCapacity: 5,
    goals: [
      "Create an accessible study dashboard",
      "Build course and assignment management",
      "Support collaborative study sessions",
    ],
  },
  {
    id: "demo-2",
    title: "Community Food Map",
    summary:
      "Help local communities discover food-sharing points and coordinate volunteer contributions.",
    description:
      "Community Food Map is a proposed platform that helps people find community food-sharing locations and coordinate volunteer contributions. The project focuses on accessibility, reliable information, and simple coordination.",
    status: "Open",
    category: "Community",
    rolesNeeded: ["Backend Developer", "Frontend Developer"],
    technologies: ["Node.js", "MongoDB", "React"],
    memberCount: 3,
    teamCapacity: 6,
    goals: [
      "Create a searchable directory of food-sharing locations",
      "Build an API for managing locations",
      "Design an accessible volunteer interface",
    ],
  },
  {
    id: "demo-3",
    title: "Open Source Issue Tracker",
    summary:
      "A lightweight workspace for small teams to organize tasks, report bugs and follow project progress.",
    description:
      "Open Source Issue Tracker is a lightweight project-management tool designed for small development teams. It aims to make reporting bugs, assigning tasks, and tracking progress straightforward.",
    status: "In Progress",
    category: "Developer Tools",
    rolesNeeded: ["Frontend Developer"],
    technologies: ["React", "Express", "MongoDB"],
    memberCount: 4,
    teamCapacity: 5,
    goals: [
      "Build an issue creation and tracking workflow",
      "Support task assignment",
      "Create a clear project activity dashboard",
    ],
  },
  {
    id: "demo-4",
    title: "Local Events Board",
    summary:
      "An accessible events directory for discovering meetups, workshops and volunteer opportunities.",
    description:
      "Local Events Board is a proposed directory where communities can discover workshops, meetups, and volunteering opportunities. The interface will prioritize straightforward discovery and mobile accessibility.",
    status: "Open",
    category: "Community",
    rolesNeeded: ["UI/UX Designer", "Backend Developer"],
    technologies: ["JavaScript", "HTML", "CSS"],
    memberCount: 1,
    teamCapacity: 4,
    goals: [
      "Create a searchable events directory",
      "Support filtering by event category",
      "Build a mobile-friendly event submission interface",
    ],
  },
];

export function getDemoProjectById(id) {
  return DEMO_PROJECTS.find((project) => project.id === id);
}
