import ProgressBar from "../ui/ProgressBar";

export default function MemberCapacity({ project }) {
  if (!project) return null;

  const members = project.members || [];
  const memberLimit = Number(project.memberLimit ?? project.teamCapacity ?? 0);
  const memberCount = members.length || project.memberCount || 0;
  const roles = project.rolesNeededDetails || [];

  return (
    <section className="member-capacity">
      <h3>Team capacity</h3>

      <ProgressBar
        value={memberCount}
        max={memberLimit || 1}
        label={`${memberCount} of ${memberLimit} team members`}
      />

      {roles.length > 0 && (
        <div className="member-capacity__roles">
          <h4>Open roles</h4>

          {roles.map((role) => {
            const slots = Number(role.slots || 1);
            const filled = Number(role.filled || 0);
            const remaining = Math.max(0, slots - filled);

            return (
              <div
                className="member-capacity__role"
                key={role._id || role.role}
              >
                <div className="member-capacity__role-heading">
                  <strong>{role.role}</strong>

                  <span>
                    {remaining} of {slots} positions available
                  </span>
                </div>

                <ProgressBar
                  value={filled}
                  max={slots}
                  label={`${role.role}: ${filled} of ${slots} filled`}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
