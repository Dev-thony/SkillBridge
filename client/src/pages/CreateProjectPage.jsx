import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectForm.css";

import { createProject } from "../services/projectService";

const INITIAL_FORM = {
  title: "",
  shortDescription: "",
  description: "",
  goals: "",
  techStack: "",
  rolesNeeded: "",
  memberLimit: "5",
};

function splitLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitCommaSeparated(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const rolesNeeded = splitLines(form.rolesNeeded).map((line) => {
      const [roleName, ...skillParts] = line.split(":");

      return {
        role: roleName.trim(),
        skills: skillParts.length
          ? splitCommaSeparated(skillParts.join(":"))
          : [],
        slots: 1,
        filled: 0,
      };
    });

    const projectData = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      goals: splitLines(form.goals),
      techStack: splitCommaSeparated(form.techStack),
      rolesNeeded,
      memberLimit: Number(form.memberLimit),
    };

    try {
      const project = await createProject(projectData);
      navigate(`/projects/${project.id}`, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="project-form-page">
      <div className="project-form-container">
        <header>
          <p className="explore-page__eyebrow">BUILD SOMETHING TOGETHER</p>
          <h1>Create a project</h1>
          <p>
            Describe your idea, the skills you need, and the team you want to
            build.
          </p>
        </header>

        <form className="project-form" onSubmit={handleSubmit}>
          <label>
            Project title *
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              minLength={3}
              maxLength={100}
              required
              placeholder="e.g. Community learning platform"
            />
          </label>

          <label>
            Short description *
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={updateField}
              minLength={10}
              maxLength={240}
              rows={3}
              required
              placeholder="Explain what the project does in a few sentences."
            />
          </label>

          <label>
            Full description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              maxLength={5000}
              rows={6}
              placeholder="Describe the problem, proposed solution, and current progress."
            />
          </label>

          <label>
            Project goals (one per line)
            <textarea
              name="goals"
              value={form.goals}
              onChange={updateField}
              rows={4}
              placeholder={"Build the MVP\nRecruit early users"}
            />
          </label>

          <label>
            Technologies (comma-separated)
            <input
              name="techStack"
              value={form.techStack}
              onChange={updateField}
              placeholder="React, Node.js, MongoDB"
            />
          </label>

          <label>
            Roles needed (one per line)
            <textarea
              name="rolesNeeded"
              value={form.rolesNeeded}
              onChange={updateField}
              rows={4}
              placeholder={
                "Frontend Developer: React, CSS\nUI/UX Designer: Figma\nBackend Developer: Node.js, MongoDB"
              }
            />
            <small>
              Format: role name, optionally followed by a colon and
              comma-separated skills.
            </small>
          </label>

          <label>
            Maximum team size (including you) *
            <input
              name="memberLimit"
              type="number"
              min="1"
              max="100"
              value={form.memberLimit}
              onChange={updateField}
              required
            />
          </label>

          {error && (
            <p className="project-form-error" role="alert">
              {error}
            </p>
          )}

          <div className="project-form-actions">
            <button
              type="button"
              className="sb-button sb-button--secondary"
              onClick={() => navigate("/explore")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sb-button sb-button--primary"
              disabled={loading}
            >
              {loading ? "Creating project..." : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
