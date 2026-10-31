import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Layers3, Users } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Badge, SkillTag } from "../components/ui";

import {
  getMyJoinRequests,
  getProject,
  submitJoinRequest,
} from "../services/projectService";

import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [project, setProject] = useState(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getProject(projectId);
      setProject(result);

      if (isAuthenticated) {
        try {
          const requests = await getMyJoinRequests();

          const existing = requests.find(
            (request) =>
              (request.project?._id || request.project?.id) === result.id,
          );

          setRequestStatus(existing?.status || "");
        } catch {
          // Project details remain available if request history cannot load.
          setRequestStatus("");
        }
      } else {
        setRequestStatus("");
      }
    } catch (loadError) {
      setError(loadError.message || "Unable to load this project.");
    } finally {
      setLoading(false);
    }
  }, [projectId, isAuthenticated]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProject();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProject]);

  async function handleJoinRequest(event) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    setError("");

    try {
      await submitJoinRequest(project.id, message);

      setRequestStatus("pending");
      setMessage("");
      setNotice("Your join request has been submitted.");
    } catch (requestError) {
      setError(requestError.message || "Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="project-details-page">
        <div className="container project-details-container">
          <p role="status">Loading project...</p>
        </div>
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className="project-details-page">
        <div className="container project-details-not-found">
          <h1>Unable to load project</h1>
          <p role="alert">{error}</p>

          <button type="button" onClick={() => void loadProject()}>
            Try again
          </button>

          <p>
            <Link to="/explore">Back to Explore Projects</Link>
          </p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="project-details-page">
        <div className="container project-details-not-found">
          <h1>Project not found</h1>
          <Link to="/explore" className="project-details-back">
            <ArrowLeft size={17} />
            Back to Explore Projects
          </Link>
        </div>
      </main>
    );
  }

  const currentMemberCount =
    project.members?.length ?? project.memberCount ?? 0;
  const memberLimit = project.teamCapacity ?? 0;
  const availablePositions = Math.max(0, memberLimit - currentMemberCount);

  const isOwner =
    Boolean(user?.id) && String(user.id) === String(project.ownerId);

  const statusTone =
    project.status === "open"
      ? "success"
      : project.status === "full"
        ? "warning"
        : "neutral";

  const canRequest =
    isAuthenticated &&
    !isOwner &&
    project.status === "open" &&
    requestStatus !== "pending" &&
    requestStatus !== "approved";

  return (
    <main className="project-details-page">
      <div className="container project-details-container">
        <Link to="/explore" className="project-details-back">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to projects
        </Link>

        <div className="project-details-layout">
          <div className="project-details-main">
            <header className="project-details-header">
              <div className="project-details-meta">
                <Badge tone={statusTone} dot>
                  {project.status}
                </Badge>

                <span>By {project.owner}</span>
              </div>

              <h1>{project.title}</h1>

              <p className="project-details-summary">{project.summary}</p>
            </header>

            <section className="project-details-section">
              <h2>About this project</h2>
              <p>{project.description || project.summary}</p>
            </section>

            {project.goals?.length > 0 && (
              <section className="project-details-section">
                <h2>Project goals</h2>

                <ul className="project-details-goals">
                  {project.goals.map((goal, index) => (
                    <li key={`${goal}-${index}`}>{goal}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="project-details-section">
              <h2>Technologies and skills</h2>

              <div className="project-details-tags">
                {project.technologies.map((technology) => (
                  <SkillTag key={technology}>{technology}</SkillTag>
                ))}

                {project.technologies.length === 0 && (
                  <p>No technologies specified yet.</p>
                )}
              </div>
            </section>

            <section className="project-details-section">
              <h2>Open roles</h2>

              {project.rolesNeededDetails.length > 0 ? (
                <div className="project-details-roles">
                  {project.rolesNeededDetails.map((role, index) => (
                    <div
                      className="project-details-role"
                      key={`${role.role}-${index}`}
                    >
                      <div>
                        <strong>{role.role}</strong>

                        {role.skills?.length > 0 && (
                          <div className="project-details-tags">
                            {role.skills.map((skill) => (
                              <SkillTag key={skill}>{skill}</SkillTag>
                            ))}
                          </div>
                        )}
                      </div>

                      <Badge tone="brand">
                        {Math.max(0, (role.slots || 1) - (role.filled || 0))}{" "}
                        needed
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No specific roles have been listed.</p>
              )}
            </section>

            {project.members?.length > 0 && (
              <section className="project-details-section">
                <h2>Team members</h2>

                <div className="project-details-roles">
                  {project.members.map((member) => (
                    <div
                      className="project-details-role"
                      key={member._id || member.id || member}
                    >
                      <span>
                        {member.name || "Team member"}
                        {member.title ? ` — ${member.title}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside
            className="project-details-sidebar"
            aria-label="Project participation"
          >
            <div className="project-details-panel">
              <h2>Project overview</h2>

              <div className="project-details-stat">
                <div className="project-details-stat-label">
                  <Users size={18} aria-hidden="true" />
                  <span>Team members</span>
                </div>

                <strong>
                  {currentMemberCount}/{memberLimit}
                </strong>
              </div>

              <div className="project-details-stat">
                <div className="project-details-stat-label">
                  <Layers3 size={18} aria-hidden="true" />
                  <span>Available positions</span>
                </div>

                <strong>{availablePositions}</strong>
              </div>

              <div className="project-details-divider" />

              {isOwner ? (
                <>
                  <h3>Your project</h3>
                  <p>Manage this project and review incoming join requests.</p>

                  <Link className="project-details-join" to="/dashboard">
                    Open dashboard
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </>
              ) : !isAuthenticated ? (
                <>
                  <h3>Interested in joining?</h3>
                  <p>Sign in to send a request to the project owner.</p>

                  <Link className="project-details-join" to="/login">
                    Sign in to request
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </>
              ) : requestStatus === "pending" ? (
                <>
                  <h3>Request pending</h3>
                  <p>
                    Your request has been sent and is waiting for the owner.
                  </p>
                </>
              ) : requestStatus === "approved" ? (
                <>
                  <h3>Request approved</h3>
                  <p>Your request was approved.</p>
                </>
              ) : !canRequest ? (
                <>
                  <h3>Not accepting requests</h3>
                  <p>This project is full or closed.</p>
                </>
              ) : (
                <>
                  <h3>Interested in joining?</h3>

                  <p>
                    Tell the project owner briefly why you want to contribute.
                  </p>

                  <form onSubmit={handleJoinRequest}>
                    <label htmlFor="join-message">Message (optional)</label>

                    <textarea
                      id="join-message"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      maxLength={1000}
                      rows={4}
                      placeholder="Introduce yourself and how you can contribute..."
                    />

                    <button
                      type="submit"
                      className="project-details-join"
                      disabled={submitting}
                    >
                      {submitting ? "Sending..." : "Request to join"}
                      {!submitting && (
                        <ArrowRight size={17} aria-hidden="true" />
                      )}
                    </button>
                  </form>
                </>
              )}

              {notice && <p role="status">{notice}</p>}
              {error && <p role="alert">{error}</p>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
