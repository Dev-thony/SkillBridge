import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProjectCard } from "../components/ui";
import "./ExplorePage.css";
import { DEMO_PROJECTS } from "../data/demoProjects";

// Illustrative projects only. Replace with API results when the backend is ready.
const CATEGORIES = [
  "All categories",
  "Community",
  "Developer Tools",
  "Education",
];
const STATUSES = ["All statuses", "Open", "In Progress"];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  const [selected, setSelected] = useState(null);

  const results = useMemo(
    () =>
      DEMO_PROJECTS.filter((project) => {
        const haystack = [
          project.title,
          project.summary,
          ...project.technologies,
          ...project.rolesNeeded,
        ]
          .join(" ")
          .toLowerCase();
        return (
          haystack.includes(query.trim().toLowerCase()) &&
          (category === CATEGORIES[0] || project.category === category) &&
          (status === STATUSES[0] || project.status === status)
        );
      }),
    [query, category, status],
  );

  function resetFilters() {
    setQuery("");
    setCategory(CATEGORIES[0]);
    setStatus(STATUSES[0]);
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
              {/* <span className="sr-only">Search projects</span> */}
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, roles or technologies"
              />
            </label>
            <div className="explore-page__filters">
              <SlidersHorizontal size={18} aria-hidden="true" />
              <label>
                <span className="sr-only">Category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {STATUSES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="explore-page__meta">
            <h2>
              Available projects <span>({results.length})</span>
            </h2>
            <span className="explore-page__demo-label">
              Sample projects · not live listings
            </span>
          </div>
          {results.length ? (
            <div className="explore-page__grid">
              {results.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewHref={`/projects/${project.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="explore-page__empty">
              <h3>No projects found</h3>
              <p>Try another search or remove a filter.</p>
              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
      {selected && (
        <div
          className="explore-page__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            className="explore-page__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="explore-dialog-title"
          >
            <button
              type="button"
              className="explore-page__close"
              aria-label="Close project preview"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <p className="explore-page__eyebrow">SAMPLE PROJECT PREVIEW</p>
            <h2 id="explore-dialog-title">{selected.title}</h2>
            <p>{selected.summary}</p>
            <h3>Roles needed</h3>
            <p>{selected.rolesNeeded.join(" · ")}</p>
            <h3>Technology</h3>
            <p>{selected.technologies.join(" · ")}</p>
            <p className="explore-page__notice">
              Joining projects will become available when authentication and the
              project API are connected.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
