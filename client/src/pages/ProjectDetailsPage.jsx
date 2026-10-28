import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Users, Layers3 } from "lucide-react";

import { Badge, SkillTag } from "../components/ui";
import { getDemoProjectById } from "../data/demoProjects";

import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project = getDemoProjectById(projectId);

  if (!project) {
    return (
      <main className="project-details-page">
        <div className="container project-details-not-found">
          <h1>Project not found</h1>
          <p>This project doesn't exist in the current demonstration data.</p>
          <Link to="/explore" className="project-details-back">
            <ArrowLeft size={17} />
            Back to Explore Projects
          </Link>
        </div>
      </main>
    );
  }

  const availablePositions = Math.max(
    0,
    project.teamCapacity - project.memberCount,
  );

  const statusTone = project.status === "Open" ? "success" : "info";

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

                <span>{project.category}</span>
              </div>

              <h1>{project.title}</h1>
              <p className="project-details-summary">{project.summary}</p>
            </header>

            <section
              className="project-details-section"
              aria-labelledby="project-about-heading"
            >
              <h2 id="project-about-heading">About this project</h2>
              <p>{project.description}</p>
            </section>

            <section
              className="project-details-section"
              aria-labelledby="project-goals-heading"
            >
              <h2 id="project-goals-heading">Project goals</h2>

              <ul className="project-details-goals">
                {project.goals.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </section>

            <section
              className="project-details-section"
              aria-labelledby="project-skills-heading"
            >
              <h2 id="project-skills-heading">Technologies and skills</h2>

              <div className="project-details-tags">
                {project.technologies.map((technology) => (
                  <SkillTag key={technology}>{technology}</SkillTag>
                ))}
              </div>
            </section>

            <section
              className="project-details-section"
              aria-labelledby="project-roles-heading"
            >
              <h2 id="project-roles-heading">Open roles</h2>

              <p>
                The project is looking for collaborators with the following
                skills:
              </p>

              <div className="project-details-roles">
                {project.rolesNeeded.map((role) => (
                  <div className="project-details-role" key={role}>
                    <span>{role}</span>
                    <Badge tone="brand">Needed</Badge>
                  </div>
                ))}
              </div>
            </section>
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
                  {project.memberCount}/{project.teamCapacity}
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

              <h3>Interested in joining?</h3>

              <p>
                Join requests will be available once authentication and the
                project API are connected.
              </p>

              <button
                type="button"
                className="project-details-join"
                disabled
                title="Join requests are not available in demo mode"
              >
                Request to join
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <p className="project-details-demo-note">
                Demonstration project — no real join requests are submitted.
              </p>
            </div>

            <div className="project-details-panel project-details-help">
              <h2>How collaboration works</h2>

              <p>
                Browse projects, review the required skills, and request to join
                a team once your profile is set up and the feature is available.
              </p>

              <Link to="/register">
                Create your profile
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
