export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const classes = [
    "sb-button",
    `sb-button--${variant}`,
    `sb-button--${size}`,
    loading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="sb-spinner" aria-hidden="true" />}

      <span>{children}</span>
    </button>
  );
}
