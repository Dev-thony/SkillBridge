import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OwnerDashboardPage.css";

import {
  closeProject,
  getProjectRequests,
  listMyProjects,
  reviewJoinRequest,
} from "../services/projectService";

export default function OwnerDashboardPage() {
  const [projects, setProjects] = useState([]);
  const [requestsByProject, setRequestsByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [busyRequest, setBusyRequest] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const ownedProjects = await listMyProjects();

      setError("");
      setProjects(ownedProjects);

      const entries = await Promise.all(
        ownedProjects.map(async (project) => {
          try {
            const requests = await getProjectRequests(project.id);
            return [project.id, requests];
          } catch (requestError) {
            return [project.id, { error: requestError.message }];
          }
        }),
      );

      setRequestsByProject(Object.fromEntries(entries));
    } catch (loadError) {
      setError(loadError.message || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard]);

  async function handleReview(requestId, status) {
    setBusyRequest(requestId);
    setError("");
    setNotice("");

    try {
      await reviewJoinRequest(requestId, status);
      setNotice(
        status === "approved"
          ? "Join request approved."
          : "Join request declined.",
      );

      await loadDashboard();
    } catch (reviewError) {
      setError(reviewError.message || "Unable to review this request.");
    } finally {
      setBusyRequest("");
    }
  }

  async function handleCloseProject(projectId) {
    const confirmed = window.confirm(
      "Close this project? It will no longer accept join requests.",
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await closeProject(projectId);
      setNotice("Project closed.");
      await loadDashboard();
    } catch (closeError) {
      setError(closeError.message || "Unable to close this project.");
    }
  }

  if (loading) {
    return (
      <main className="owner-dashboard container">
        <p role="status">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="owner-dashboard container">
      <header className="owner-dashboard__header">
        <div>
          <p className="explore-page__eyebrow">PROJECT MANAGEMENT</p>
          <h1>Owner dashboard</h1>
          <p>Manage your projects and review people who want to join.</p>
        </div>

        <Link className="sb-button sb-button--primary" to="/projects/new">
          Create project
        </Link>
      </header>

      {error && (
        <p className="owner-dashboard__error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="owner-dashboard__notice" role="status">
          {notice}
        </p>
      )}

      {projects.length === 0 ? (
        <section className="owner-dashboard__empty">
          <h2>You haven't created a project yet</h2>
          <p>Create a project to find collaborators and build your team.</p>
          <Link className="sb-button sb-button--primary" to="/projects/new">
            Create your first project
          </Link>
        </section>
      ) : (
        <div className="owner-dashboard__projects">
          {projects.map((project) => {
            const projectRequests = requestsByProject[project.id];
            const requests = Array.isArray(projectRequests)
              ? projectRequests
              : [];
            const pendingRequests = requests.filter(
              (request) => request.status === "pending",
            );

            return (
              <section className="owner-dashboard__project" key={project.id}>
                <div className="owner-dashboard__project-heading">
                  <div>
                    <span
                      className={`owner-dashboard__status owner-dashboard__status--${project.status}`}
                    >
                      {project.status}
                    </span>

                    <h2>{project.title}</h2>
                    <p>{project.summary}</p>

                    <small>
                      {project.memberCount}/{project.teamCapacity} members
                    </small>
                  </div>

                  <div className="owner-dashboard__actions">
                    <Link to={`/projects/${project.id}`}>View project</Link>

                    {project.status !== "closed" && (
                      <button
                        type="button"
                        onClick={() => handleCloseProject(project.id)}
                      >
                        Close project
                      </button>
                    )}
                  </div>
                </div>

                <div className="owner-dashboard__requests">
                  <h3>Join requests ({pendingRequests.length} pending)</h3>
                  {projectRequests && !Array.isArray(projectRequests) && (
                    <p role="alert">
                      Unable to load requests for this project.
                    </p>
                  )}
                  {pendingRequests.length === 0 ? (
                    <p>No pending join requests.</p>
                  ) : (
                    pendingRequests.map((request) => (
                      <article
                        className="owner-dashboard__request"
                        key={request._id}
                      >
                        <div>
                          <strong>
                            {request.applicant?.name || "Applicant"}
                          </strong>

                          {request.applicant?.title && (
                            <p>{request.applicant.title}</p>
                          )}

                          {request.applicant?.skills?.length > 0 && (
                            <p>Skills: {request.applicant.skills.join(", ")}</p>
                          )}

                          <p>{request.message || "No message provided."}</p>
                        </div>

                        <div className="owner-dashboard__request-actions">
                          <button
                            type="button"
                            disabled={busyRequest === request._id}
                            onClick={() =>
                              handleReview(request._id, "approved")
                            }
                          >
                            {busyRequest === request._id
                              ? "Saving..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            disabled={busyRequest === request._id}
                            onClick={() =>
                              handleReview(request._id, "declined")
                            }
                          >
                            Decline
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
