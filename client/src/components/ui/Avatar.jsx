function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export function Avatar({ name, src, size = "md", className = "" }) {
  return (
    <span
      className={`sb-avatar sb-avatar--${size} ${className}`.trim()}
      aria-label={name || "Team member"}
      title={name || "Team member"}
    >
      {src ? (
        <img src={src} alt="" />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}

export function AvatarGroup({ members = [], max = 4, size = "sm" }) {
  const visibleMembers = members.slice(0, max);
  const remaining = Math.max(0, members.length - visibleMembers.length);

  return (
    <div
      className="sb-avatar-group"
      aria-label={`${members.length} team members`}
    >
      {visibleMembers.map((member, index) => (
        <Avatar
          key={member.id || `${member.name}-${index}`}
          name={member.name}
          src={member.avatarUrl}
          size={size}
        />
      ))}

      {remaining > 0 && (
        <span className={`sb-avatar sb-avatar--${size} sb-avatar--overflow`}>
          +{remaining}
        </span>
      )}
    </div>
  );
}
