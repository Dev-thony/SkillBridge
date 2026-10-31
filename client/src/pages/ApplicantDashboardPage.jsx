import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyJoinRequests } from "../services/projectService";

import "./ApplicantDashboardPage.css";

function getProjectId(project) {
  if (!project) return null;

  return typeof project === "object" ? project._id || project.id : project;
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export default function ApplicantDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJoinRequests();

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load your applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMyJoinRequests();

        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load applications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = requests.filter(
    (request) => request.status === "pending",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "approved",
  ).length;

  const declinedCount = requests.filter(
    (request) => request.status === "declined",
  ).length;

  return (
    <main className="applicant-dashboard container">
      <header className="applicant-dashboard__header">
        <div>
          <p className="applicant-dashboard__eyebrow">MY APPLICATIONS</p>

          <h1>Applicant Dashboard</h1>

          <p>
            Track the projects you've applied to and monitor your application
            statuses.
          </p>
        </div>

        <Link to="/explore" className="sb-button sb-button--primary">
          Explore Projects
        </Link>
      </header>

      {!loading && !error && (
        <section
          className="applicant-dashboard__stats"
          aria-label="Application statistics"
        >
          <article>
            <strong>{requests.length}</strong>
            <span>Total Applications</span>
          </article>

          <article>
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </article>

          <article>
            <strong>{approvedCount}</strong>
            <span>Approved</span>
          </article>

          <article>
            <strong>{declinedCount}</strong>
            <span>Declined</span>
          </article>
        </section>
      )}

      {loading && <p role="status">Loading applications...</p>}

      {error && (
        <div className="applicant-dashboard__error" role="alert">
          <p>{error}</p>

          <button type="button" onClick={loadRequests}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <section className="applicant-dashboard__empty">
          <h2>No applications yet</h2>

          <p>
            Find an interesting project and submit a request to join its team.
          </p>

          <Link to="/explore" className="sb-button sb-button--primary">
            Find Projects
          </Link>
        </section>
      )}

      {!loading && !error && requests.length > 0 && (
        <section className="applicant-dashboard__list">
          {requests.map((request) => {
            const project = request.project;
            const projectId = getProjectId(project);

            return (
              <article
                className="applicant-dashboard__card"
                key={request._id || request.id}
              >
                <div className="applicant-dashboard__card-top">
                  <div>
                    <h2>{project?.title || "Project unavailable"}</h2>

                    <p>Applied: {formatDate(request.createdAt)}</p>
                  </div>

                  <span
                    className={`applicant-dashboard__status applicant-dashboard__status--${request.status}`}
                  >
                    {request.status}
                  </span>
                </div>

                {request.message && (
                  <div className="applicant-dashboard__message">
                    <strong>Your message</strong>
                    <p>{request.message}</p>
                  </div>
                )}

                {request.status === "approved" && (
                  <p className="applicant-dashboard__success">
                    Your request was approved. You are now a member of this
                    project.
                  </p>
                )}

                {request.status === "pending" && (
                  <p>Your request is awaiting the project owner's decision.</p>
                )}

                {request.status === "declined" && (
                  <p>Your request was declined.</p>
                )}

                {projectId && (
                  <Link to={`/projects/${projectId}`}>View Project →</Link>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
