const VALID_TONES = ["info", "success", "warning", "danger"];

export function Alert({ title, children, tone = "info", className = "" }) {
  const safeTone = VALID_TONES.includes(tone) ? tone : "info";

  const isError = safeTone === "danger";

  return (
    <div
      className={`sb-alert sb-alert--${safeTone} ${className}`.trim()}
      role={isError ? "alert" : "status"}
    >
      {title && <p className="sb-alert__title">{title}</p>}

      <div className="sb-alert__body">{children}</div>
    </div>
  );
}
