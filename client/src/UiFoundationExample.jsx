import {
  Alert,
  Badge,
  Button,
  EmptyState,
  ProjectCard,
  SelectField,
  SkillTag,
  TextField,
} from "./components/ui";

const exampleProject = {
  id: "example-project",
  title: "Open-source Learning Tracker",
  summary:
    "A learning tracker with weekly goals, progress updates, and a shared roadmap.",
  status: "Open for join requests",
  rolesNeeded: ["Frontend", "Backend", "UI/UX Design"],
  technologies: ["React", "Node.js", "MongoDB"],
  members: [
    { id: "1", name: "Alex Rivera" },
    { id: "2", name: "Sam Chen" },
  ],
  memberCount: 2,
  teamCapacity: 4,
};

export default function UiFoundationExample() {
  return (
    <main
      className="sb-container"
      style={{
        paddingBlock: "2rem",
        display: "grid",
        gap: "2rem",
      }}
    >
      <section>
        <h2>Buttons</h2>

        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2>Status and skills</h2>

        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <Badge tone="success" dot>
            Open
          </Badge>
          <Badge tone="warning">Pending review</Badge>
          <Badge tone="danger">Declined</Badge>
          <SkillTag>React</SkillTag>
          <SkillTag tone="muted">MongoDB</SkillTag>
        </div>
      </section>

      <section>
        <h2>Project card</h2>
        <ProjectCard project={exampleProject} />
      </section>

      <section style={{ display: "grid", gap: "1rem", maxWidth: "520px" }}>
        <h2>Form controls</h2>

        <TextField
          label="Project title"
          placeholder="Enter a project title"
          required
        />

        <SelectField
          label="Available role"
          placeholder="Choose a role"
          options={["Frontend", "Backend", "UI/UX Design"]}
        />

        <Alert tone="info" title="Before submitting">
          Review the project details before creating it.
        </Alert>
      </section>

      <section>
        <h2>Empty state</h2>

        <EmptyState
          title="No matching projects"
          description="Try another search or remove a filter."
          actionLabel="Clear filters"
          onAction={() => console.log("Clear filters clicked")}
        />
      </section>
    </main>
  );
}
