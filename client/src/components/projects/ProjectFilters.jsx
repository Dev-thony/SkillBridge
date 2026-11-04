import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

const STATUSES = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "Full", value: "full" },
  { label: "Closed", value: "closed" },
];

export default function ProjectFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="project-filters">
      <label className="project-filters__search">
        <Search size={19} aria-hidden="true" />

        {/* <span className="sr-only">Search projects</span> */}

        <input
          className="project-filters__search-text"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search projects, roles or technologies"
        />
      </label>

      <div className="project-filters__status">
        <SlidersHorizontal size={18} aria-hidden="true" />

        <label htmlFor="project-status">Project status</label>

        <select
          id="project-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={onReset}>
        <RotateCcw size={15} />
        Reset
      </button>
    </div>
  );
}
