import { useId } from "react";

export function TextField({
  label,
  hint,
  error,
  id,
  className = "",
  required = false,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;

  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`sb-field ${className}`.trim()}>
      {label && (
        <label className="sb-field__label" htmlFor={fieldId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <input
        id={fieldId}
        className={`sb-input ${error ? "sb-input--error" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        {...props}
      />

      {hint && !error && (
        <p className="sb-field__hint" id={hintId}>
          {hint}
        </p>
      )}

      {error && (
        <p className="sb-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
