import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getProject, updateProject } from "../services/projectService";

import "./ProjectForm.css";

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

export default function EditProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    goals: "",
    techStack: "",
    rolesNeeded: "",
    memberLimit: "5",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        const project = await getProject(projectId);

        if (cancelled) return;

        if (String(project.ownerId) !== String(user?.id)) {
          navigate("/dashboard", { replace: true });
          return;
        }

        setForm({
          title: project.title || "",
          shortDescription: project.shortDescription || "",
          description: project.description || "",
          goals: (project.goals || []).join("\n"),
          techStack: (project.techStack || []).join(", "),
          rolesNeeded: (project.rolesNeededDetails || [])
            .map((role) => {
              const skills = (role.skills || []).join(", ");
              const slots = role.slots || 1;
              return `${role.role}${skills ? `: ${skills}` : ""} | ${slots}`;
            })
            .join("\n"),
          memberLimit: String(project.memberLimit || 5),
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load project.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId, user, navigate]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    const rolesNeeded = splitLines(form.rolesNeeded).map((line) => {
      const [roleAndSkills, slotValue] = line.split("|");
      const [roleName, ...skillParts] = roleAndSkills.split(":");

      return {
        role: roleName.trim(),
        skills: skillParts.length
          ? splitCommaSeparated(skillParts.join(":"))
          : [],
        slots: slotValue ? Number(slotValue.trim()) : 1,
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
      const updatedProject = await updateProject(projectId, projectData);

      navigate(`/projects/${updatedProject.id}`, { replace: true });
    } catch (saveError) {
      setError(saveError.message || "Unable to update project.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="project-form-page">
        <div className="project-form-container">
          <p role="status">Loading project information...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="project-form-page">
      <div className="project-form-container">
        <Link to={`/projects/${projectId}`} className="project-details-back">
          <ArrowLeft size={17} />
          Back to project
        </Link>

        <header>
          <p className="explore-page__eyebrow">PROJECT MANAGEMENT</p>
          <h1>Edit project</h1>
          <p>Update your project details and collaboration requirements.</p>
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
                "Frontend Developer: React, CSS | 2\nBackend Developer: Node.js | 1"
              }
            />
            <small>
              Format: Role: skill1, skill2 | number needed. Example: Frontend
              Developer: React, CSS | 2
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
              onClick={() => navigate(`/projects/${projectId}`)}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sb-button sb-button--primary"
              disabled={saving}
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
