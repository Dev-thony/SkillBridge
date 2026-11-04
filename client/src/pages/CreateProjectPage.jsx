import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProjectForm.css";
import {
  createProject,
  getProject,
  updateProject,
} from "../services/projectService";

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

function formatRoles(roles = []) {
  return roles
    .map(
      (role) =>
        `${role.role} (${role.slots || 1})${
          role.skills?.length ? `: ${role.skills.join(", ")}` : ""
        }`,
    )
    .join("\n");
}

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isEditing = Boolean(projectId);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    let active = true;

    getProject(projectId)
      .then((project) => {
        if (!active) return;

        setForm({
          title: project.title || "",
          shortDescription: project.shortDescription || project.summary || "",
          description: project.description || "",
          goals: (project.goals || []).join("\n"),
          techStack: (project.technologies || []).join(", "),
          rolesNeeded: formatRoles(project.rolesNeededDetails),
          memberLimit: String(project.teamCapacity || 5),
        });
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load project.");
      })
      .finally(() => {
        if (active) setInitialLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isEditing, projectId]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const rolesNeeded = splitLines(form.rolesNeeded).map((line) => {
      const [rolePart, ...skillParts] = line.split(":");
      const match = rolePart.trim().match(/^(.*?)\s*\((\d+)\)\s*$/);

      return {
        role: (match ? match[1] : rolePart).trim(),
        slots: match ? Number(match[2]) : 1,
        skills: skillParts.length
          ? splitCommaSeparated(skillParts.join(":"))
          : [],
      };
    });

    if (rolesNeeded.some((role) => !role.role || role.slots < 1)) {
      setError("Check your role names and required number of people.");
      setLoading(false);
      return;
    }

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
      const project = isEditing
        ? await updateProject(projectId, projectData)
        : await createProject(projectData);

      navigate(`/projects/${project.id}`, { replace: true });
    } catch (err) {
      setError(
        err.message || `Unable to ${isEditing ? "update" : "create"} project.`,
      );
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <main className="project-form-page">
        <div className="project-form-container">
          <p>Loading project...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="project-form-page">
      <div className="project-form-container">
        <header>
          <p className="explore-page__eyebrow">BUILD SOMETHING TOGETHER</p>
          <h1>{isEditing ? "Edit project" : "Create a project"}</h1>
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
            />
          </label>

          <label>
            Project goals (one per line)
            <textarea
              name="goals"
              value={form.goals}
              onChange={updateField}
              rows={4}
            />
          </label>

          <label>
            Technologies (comma-separated)
            <input
              name="techStack"
              value={form.techStack}
              onChange={updateField}
            />
          </label>

          <label>
            Roles needed (one per line)
            <textarea
              name="rolesNeeded"
              value={form.rolesNeeded}
              onChange={updateField}
              rows={5}
              placeholder={
                "Frontend Developer (2): React, CSS\nUI/UX Designer (1): Figma"
              }
            />
            <small>
              Format: Role name (number of people needed): skill 1, skill 2.
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
              onClick={() =>
                navigate(isEditing ? `/projects/${projectId}` : "/explore")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sb-button sb-button--primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
