import { useId } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export function EmptyState({
  title = "Nothing to show yet",
  description,
  actionLabel,
  onAction,
  actionHref,
  className = "",
}) {
  const generatedId = useId();

  const headingId = `sb-empty-${generatedId.replace(/:/g, "")}`;

  const action = actionLabel ? (
    actionHref ? (
      actionHref.startsWith("/") ? (
        <Link
          className="sb-button sb-button--secondary sb-button--sm"
          to={actionHref}
        >
          {actionLabel}
        </Link>
      ) : (
        <a
          className="sb-button sb-button--secondary sb-button--sm"
          href={actionHref}
        >
          {actionLabel}
        </a>
      )
    ) : onAction ? (
      <Button variant="secondary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null
  ) : null;

  return (
    <section
      className={`sb-empty-state ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <div className="sb-empty-state__mark" aria-hidden="true">
        —
      </div>

      <h2 className="sb-empty-state__title" id={headingId}>
        {title}
      </h2>

      {description && (
        <p className="sb-empty-state__description">{description}</p>
      )}

      {action && <div className="sb-empty-state__action">{action}</div>}
    </section>
  );
}
