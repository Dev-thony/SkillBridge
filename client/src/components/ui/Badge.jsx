const allowedTones = [
  "neutral",
  "brand",
  "success",
  "warning",
  "danger",
  "info",
];

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className = "",
}) {
  const safeTone = allowedTones.includes(tone) ? tone : "neutral";

  return (
    <span className={`sb-badge sb-badge--${safeTone} ${className}`.trim()}>
      {dot && <span className="sb-badge__dot" aria-hidden="true" />}

      {children}
    </span>
  );
}
