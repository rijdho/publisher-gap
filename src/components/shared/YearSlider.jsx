import { useState } from "react";

export default function YearSlider({ years, defaultAll = true, onYearChange }) {
  const [allMode, setAllMode] = useState(defaultAll);
  const [year, setYear] = useState(years[years.length - 1] || 2025);

  const handleAllClick = () => {
    const next = !allMode;
    setAllMode(next);
    onYearChange(next ? "all" : year);
  };

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setYear(val);
    setAllMode(false);
    onYearChange(val);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleAllClick}
        className="px-4 py-1.5 text-sm rounded-lg font-bold flex-shrink-0 transition-all"
        style={
          allMode
            ? {
                background: "var(--color-btn-active-bg)",
                color: "var(--color-contrast-text)",
                border: "2px solid var(--color-btn-active-border)",
                boxShadow: `0 0 16px var(--color-btn-active-glow)`,
                fontWeight: 800,
              }
            : {
                background: "var(--color-surface)",
                color: "var(--color-text-muted)",
                border: "2px solid var(--color-surface-alt)",
              }
        }
      >
        {allMode ? "All years" : "All"}
      </button>
      <span
        className="text-xs font-mono"
        style={{ color: "var(--color-text-muted)" }}
      >
        {years[0]}
      </span>
      <input
        type="range"
        min={years[0]}
        max={years[years.length - 1]}
        value={year}
        onChange={handleSlider}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: "var(--color-accent)",
          opacity: allMode ? 0.3 : 1,
        }}
      />
      <span
        className="text-xs font-mono"
        style={{ color: "var(--color-text-muted)" }}
      >
        {years[years.length - 1]}
      </span>
      {!allMode && (
        <span
          className="text-sm font-bold font-mono px-2 py-0.5 rounded"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-contrast-text)",
            minWidth: 48,
            textAlign: "center",
          }}
        >
          {year}
        </span>
      )}
    </div>
  );
}
