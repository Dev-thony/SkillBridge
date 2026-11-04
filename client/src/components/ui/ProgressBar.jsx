export default function ProgressBar({
  value = 0,
  max = 100,
  label = "Progress",
}) {
  const safeMax = Math.max(1, Number(max) || 1);
  const safeValue = Math.min(safeMax, Math.max(0, Number(value) || 0));
  const percentage = Math.round((safeValue / safeMax) * 100);

  return (
    <div className="sb-progress">
      <div className="sb-progress__heading">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>

      <div
        className="sb-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div
          className="sb-progress__value"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
