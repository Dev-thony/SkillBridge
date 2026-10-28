export function SkillTag({ children, tone = "default", className = "" }) {
  return (
    <span className={`sb-skill-tag sb-skill-tag--${tone} ${className}`.trim()}>
      {children}
    </span>
  );
}
