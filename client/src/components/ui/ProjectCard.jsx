import { Link } from "react-router-dom";

import { Badge } from "./Badge";
import { SkillTag } from "./SkillTag";
import { AvatarGroup } from "./Avatar";

const STATUS_TONES = {
  open: "success",
  "open for join requests": "success",
  "in progress": "info",
  "pending review": "warning",
  full: "neutral",
  completed: "brand",
  draft: "neutral",
};

function getStatusTone(status) {
  const normalizedStatus = String(status || "Open").toLowerCase();

  return STATUS_TONES[normalizedStatus] || "neutral";
}

export function ProjectCard({ project, onView, viewHref, className = "" }) {
  if (!project) {
    return null;
  }

  const {
    id,
    _id,
    title,
    summary,
    description,
    status = "Open",
    updatedAt,
    rolesNeeded = [],
    technologies = [],
    members = [],
    memberCount,
    teamCapacity,
    owner,
    href,
  } = project;

  const projectId = id || _id;

  const destination =
    viewHref || href || (projectId ? `/projects/${projectId}` : null);

  const displaySummary = summary || description;

  const currentMemberCount = memberCount ?? members.length;

  const statusTone = getStatusTone(status);

  const formattedUpdatedAt =
    updatedAt && typeof updatedAt === "string" ? updatedAt : null;

  const cardClassName = ["sb-project-card", className]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <div className="sb-project-card__topline">
        <Badge tone={statusTone} dot>
          {status}
        </Badge>

        {formattedUpdatedAt && (
          <span className="sb-project-card__updated">{formattedUpdatedAt}</span>
        )}
      </div>

      <div className="sb-project-card__content">
        <h3 className="sb-project-card__title">
          {destination ? (
            <Link className="sb-project-card__title-link" to={destination}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        {displaySummary && (
          <p className="sb-project-card__summary">{displaySummary}</p>
        )}

        {rolesNeeded.length > 0 && (
          <div className="sb-project-card__group">
            <span className="sb-project-card__eyebrow">Roles needed</span>

            <div className="sb-tag-list">
              {rolesNeeded.map((role) => (
                <SkillTag key={role}>{role}</SkillTag>
              ))}
            </div>
          </div>
        )}

        {technologies.length > 0 && (
          <div
            className="sb-tag-list sb-project-card__technologies"
            aria-label="Technologies used"
          >
            {technologies.slice(0, 5).map((technology) => (
              <SkillTag key={technology} tone="muted">
                {technology}
              </SkillTag>
            ))}

            {technologies.length > 5 && (
              <span className="sb-project-card__more">
                +{technologies.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="sb-project-card__footer">
        <div className="sb-project-card__team">
          {members.length > 0 && (
            <AvatarGroup members={members} max={3} size="sm" />
          )}

          {teamCapacity != null ? (
            <span>
              {currentMemberCount} of {teamCapacity} members
            </span>
          ) : memberCount != null ? (
            <span>{currentMemberCount} members</span>
          ) : owner ? (
            <span>By {owner}</span>
          ) : null}
        </div>

        {destination ? (
          <Link
            className="sb-button sb-button--primary sb-button--sm"
            to={destination}
          >
            View details
          </Link>
        ) : onView ? (
          <button
            className="sb-button sb-button--primary sb-button--sm"
            type="button"
            onClick={onView}
          >
            View details
          </button>
        ) : null}
      </div>
    </article>
  );
}
