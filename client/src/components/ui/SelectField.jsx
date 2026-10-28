import { useId } from "react";

export function SelectField({
  label,
  hint,
  error,
  id,
  options = [],
  placeholder = "Select an option",
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
          {required && (
            <span className="sb-field__required" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
      )}

      <select
        {...props}
        id={fieldId}
        required={required}
        className={`sb-input sb-select ${error ? "sb-input--error" : ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;

          const text = typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>

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
