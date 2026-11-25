import { useState } from "react";
import { CATEGORIES as CAT_META } from "../../lib/categories";

function cellColor(value, mode) {
  if (mode === "delta") {
    if (value > 0.5) return "#047857";
    if (value > 0.3) return "#059669";
    if (value > 0.2) return "#10b981";
    if (value > 0.1) return "#34d399";
    if (value > 0.02) return "#6ee7b7";
    if (value > -0.02) return "#475569";
    if (value > -0.1) return "#fca5a5";
    if (value > -0.2) return "#f87171";
    if (value > -0.3) return "#ef4444";
    return "#dc2626";
  }
  if (value >= 0.9) return "#047857";
  if (value >= 0.8) return "#059669";
  if (value >= 0.7) return "#10b981";
  if (value >= 0.6) return "#34d399";
  if (value >= 0.5) return "#fbbf24";
  if (value >= 0.4) return "#f97316";
  if (value >= 0.2) return "#ef4444";
  return "#dc2626";
}

const NON_COMPARABLE_IDS = new Set([
  "article_number", "update_policy", "jats_abstract", "assertions", "archive",
  "credit_roles", "data_availability", "peer_review_info",
  "clinical_trial", "abstract_structured",
]);

function SampleModal({ field, publisher, samples, crossref, openalex, onClose }) {
  if (!samples || samples.length === 0) return null;
  const gap = openalex - crossref;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--color-overlay)" }}
      onClick={onClose}
    >
      <div
        className="rounded-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
              {field.label}, {publisher.label}
            </h4>
            <div className="flex gap-3 mt-1 text-xs">
              <span style={{ color: "var(--color-crossref)" }}>CR: {(crossref * 100).toFixed(0)}%</span>
              <span style={{ color: "var(--color-openalex)" }}>OA: {(openalex * 100).toFixed(0)}%</span>
              <span style={{ color: gap > 0 ? "var(--color-gap-positive)" : "var(--color-text-muted)" }}>
                Gap: {gap > 0 ? "+" : ""}{(gap * 100).toFixed(0)}pp
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-lg px-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            &times;
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          Sample articles where OpenAlex has this field but Crossref does not (gap examples):
        </p>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th className="text-left py-1.5 px-2" style={{ color: "var(--color-text-muted)" }}>Title</th>
              <th className="text-center py-1.5 px-2 w-16" style={{ color: "var(--color-text-muted)" }}>DOI</th>
              <th className="text-center py-1.5 px-2 w-16" style={{ color: "var(--color-crossref)" }}>Crossref</th>
              <th className="text-center py-1.5 px-2 w-16" style={{ color: "var(--color-openalex)" }}>OpenAlex</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="py-1.5 px-2" style={{ color: "var(--color-text)", maxWidth: 350 }}>
                  <span className="line-clamp-2">{s.title}</span>
                </td>
                <td className="py-1.5 px-2 text-center">
                  <a href={`https://doi.org/${s.doi}`} target="_blank" rel="noopener noreferrer"
                    className="hover:underline" style={{ color: "var(--color-accent)" }}>
                    link
                  </a>
                </td>
                <td className="py-1.5 px-2 text-center">
                  <a href={`https://api.crossref.org/works/${s.doi}`} target="_blank" rel="noopener noreferrer"
                    className="hover:underline" style={{ color: "var(--color-crossref)" }}>
                    JSON
                  </a>
                </td>
                <td className="py-1.5 px-2 text-center">
                  <a href={`https://api.openalex.org/works/doi:${s.doi}`} target="_blank" rel="noopener noreferrer"
                    className="hover:underline" style={{ color: "var(--color-openalex)" }}>
                    JSON
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function GapHeatmap({ heatmap, year }) {
  const [mode, setMode] = useState("crossref");
  const [effortFilter, setEffortFilter] = useState("voluntary");
  const [maxPubs, setMaxPubs] = useState(0);
  const [selected, setSelected] = useState(null); // { field, publisher }

  if (!heatmap) return null;

  const allFields = heatmap.fields.filter((f) => !NON_COMPARABLE_IDS.has(f.id));
  const fields = effortFilter === "all"
    ? allFields
    : allFields.filter((f) => f.effort === effortFilter);
  const allPublishers = heatmap.publishers;
  const publishers = maxPubs > 0 ? allPublishers.slice(0, maxPubs) : allPublishers;

  const handleCellClick = (field, pub) => {
    const samples = heatmap.samples?.[pub.id]?.[field.id];
    if (samples && samples.length > 0) {
      setSelected({ field, publisher: pub });
    }
  };

  return (
    <div
      className="rounded-lg p-4 fade-in overflow-x-auto"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold">Field Completeness Heatmap {year && `(${year})`}</h3>
          <div className="flex gap-1 mt-1 flex-wrap">
            <button
              onClick={() => setEffortFilter(effortFilter === "voluntary" ? "all" : "voluntary")}
              className="px-2 py-0.5 rounded-full font-medium"
              style={{
                fontSize: 10,
                background: effortFilter === "voluntary" ? "var(--color-voluntary-dim)" : "var(--color-surface-alt)",
                color: effortFilter === "voluntary" ? "var(--color-voluntary)" : "var(--color-text-muted)",
                border: effortFilter === "voluntary" ? "1px solid var(--color-voluntary)" : "1px solid transparent",
              }}
            >
              Voluntary only
            </button>
            {[5, 8, 0].map((n) => (
              <button
                key={n}
                onClick={() => setMaxPubs(n)}
                className="px-2 py-0.5 rounded-full font-medium lg:hidden"
                style={{
                  fontSize: 10,
                  background: maxPubs === n ? "var(--color-accent-dim)" : "var(--color-surface-alt)",
                  color: maxPubs === n ? "var(--color-accent)" : "var(--color-text-muted)",
                }}
              >
                {n === 0 ? `All (${allPublishers.length})` : `Top ${n}`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          {["crossref", "openalex", "delta"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-3 py-1 text-xs rounded-full font-medium"
              style={{
                background: mode === m ? "var(--color-accent-dim)" : "var(--color-surface-alt)",
                color: mode === m ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              {m === "delta" ? "Gap" : m === "crossref" ? "Crossref" : "OpenAlex"}
            </button>
          ))}
        </div>
      </div>

      <table className="text-xs" style={{ borderCollapse: "separate", borderSpacing: 1 }}>
        <thead>
          <tr>
            <th
              className="text-left px-2 py-1 sticky left-0"
              style={{ background: "var(--color-surface)", minWidth: 140 }}
            >
              Field
            </th>
            {publishers.map((p) => (
              <th
                key={p.id}
                className="px-1 py-1 font-medium"
                style={{
                  color: "var(--color-text-muted)",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  height: 100,
                }}
              >
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id}>
              <td
                className="px-2 py-1 sticky left-0 whitespace-nowrap"
                style={{
                  background: "var(--color-surface)",
                  color: CAT_META[field.category]?.colorLight || "var(--color-text-muted)",
                  fontSize: 11,
                }}
              >
                {field.label}
              </td>
              {publishers.map((pub) => {
                let value;
                if (mode === "delta") {
                  value =
                    (heatmap.openalex[pub.id]?.[field.id] || 0) -
                    (heatmap.crossref[pub.id]?.[field.id] || 0);
                } else {
                  value = heatmap[mode]?.[pub.id]?.[field.id] || 0;
                }

                const hasSamples = heatmap.samples?.[pub.id]?.[field.id]?.length > 0;

                return (
                  <td
                    key={pub.id}
                    className="px-1 py-1 text-center font-mono"
                    style={{
                      background: cellColor(value, mode),
                      color: "#fff",
                      fontSize: 10,
                      minWidth: 36,
                      cursor: hasSamples ? "pointer" : "default",
                      outline: selected?.field.id === field.id && selected?.publisher.id === pub.id
                        ? "2px solid var(--color-accent)"
                        : "none",
                    }}
                    title={`${field.label} / ${pub.label}: ${(value * 100).toFixed(0)}%${hasSamples ? ". Click to see sample articles" : ""}`}
                    onClick={() => handleCellClick(field, pub)}
                  >
                    {(value * 100).toFixed(0)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Color legend */}
      <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span>{mode === "delta" ? "OA < CR" : "Low"}</span>
        <div className="flex h-3 rounded overflow-hidden" style={{ width: 120 }}>
          {(mode === "delta"
            ? ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#475569", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857"]
            : ["#dc2626", "#ef4444", "#f97316", "#fbbf24", "#34d399", "#10b981", "#059669", "#047857"]
          ).map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <span>{mode === "delta" ? "OA > CR" : "High"}</span>
        <span style={{ color: "var(--color-border)" }}>|</span>
        <span>Click any cell to see sample articles</span>
      </div>

      {/* Sample articles modal */}
      {selected && (
        <SampleModal
          field={selected.field}
          publisher={selected.publisher}
          samples={heatmap.samples?.[selected.publisher.id]?.[selected.field.id] || []}
          crossref={heatmap.crossref[selected.publisher.id]?.[selected.field.id] || 0}
          openalex={heatmap.openalex[selected.publisher.id]?.[selected.field.id] || 0}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
