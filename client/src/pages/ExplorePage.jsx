import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import { ProjectCard } from "../components/ui";
import { listProjects } from "../services/projectService";

import "./ExplorePage.css";

const STATUSES = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "Full", value: "full" },
  { label: "Closed", value: "closed" },
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("open");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const result = await listProjects({
          search: query,
          status,
        });

        if (!cancelled) {
          setProjects(result.projects);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.message ||
              "We couldn't load projects. Please try again.",
          );
          setProjects([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, status, retry]);

  function resetFilters() {
    setQuery("");
    setStatus("open");
  }

  return (
    <main className="explore-page">
      <div className="container explore-page__container">
        <div className="explore-page__heading">
          <p className="explore-page__eyebrow">FIND YOUR NEXT COLLABORATION</p>

          <h1>Explore Projects</h1>

          <p>
            Discover ideas, find a team that needs your skills, and build
            something together.
          </p>
        </div>

        <section className="explore-page__browser" aria-label="Browse projects">
          <div className="explore-page__toolbar">
            <label className="explore-page__search">
              <Search size={19} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, roles or technologies"
              />
            </label>

            <div className="explore-page__filters">
              <SlidersHorizontal size={18} aria-hidden="true" />

              <label className="explore-page__filters">
                <span className="sr-only">Project status</span>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="explore-page__meta">
            <h2>
              {status === "all"
                ? "Projects"
                : `${status[0].toUpperCase()}${status.slice(1)} projects`}{" "}
              <span>({projects.length})</span>
            </h2>

            <Link to="/projects/new" className="sb-button sb-button--primary">
              Create a project
            </Link>
          </div>

          {loading && (
            <p role="status" aria-live="polite">
              Loading projects...
            </p>
          )}

          {!loading && error && (
            <div className="explore-page__empty" role="alert">
              <h3>Unable to load projects</h3>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => setRetry((value) => value + 1)}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="explore-page__grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewHref={`/projects/${project.id}`}
                />
              ))}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="explore-page__empty">
              <h3>No projects found</h3>

              <p>
                Try a different search, select another status, or create the
                first project.
              </p>

              <button type="button" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
