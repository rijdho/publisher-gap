import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { PUBLISHER_COLORS } from "../../lib/publishers";

/** Custom tooltip: Crossref first, then OpenAlex, grouped by publisher */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  // Group by publisher (strip _cr / _oa suffix)
  const grouped = {};
  for (const entry of payload) {
    const key = entry.dataKey;
    const pubId = key.replace(/_cr$/, "").replace(/_oa$/, "");
    const isCR = key.endsWith("_cr");
    if (!grouped[pubId]) grouped[pubId] = { color: entry.color, name: entry.name };
    if (isCR) grouped[pubId].cr = entry.value;
    else grouped[pubId].oa = entry.value;
  }

  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>
        {label}
      </div>
      {Object.entries(grouped).map(([pubId, data]) => {
        const pubName = (data.name || pubId)
          .replace(/ \(CR\)$/, "")
          .replace(/ \(OA\)$/, "");
        return (
          <div key={pubId} className="mb-1">
            <div className="font-medium" style={{ color: data.color }}>
              {pubName}
            </div>
            {data.cr != null && (
              <div className="flex items-center gap-1.5 ml-2" style={{ color: "var(--color-text-muted)" }}>
                <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke={data.color} strokeWidth="2" /></svg>
                Crossref: {data.cr}%
              </div>
            )}
            {data.oa != null && (
              <div className="flex items-center gap-1.5 ml-2" style={{ color: "var(--color-text-muted)" }}>
                <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke={data.color} strokeWidth="2" strokeDasharray="4 2" /></svg>
                OpenAlex: {data.oa}%
              </div>
            )}
            {data.cr != null && data.oa != null && (
              <div className="ml-2" style={{ color: data.oa > data.cr ? "var(--color-gap-positive)" : "var(--color-text-muted)" }}>
                Gap: {data.oa > data.cr ? "+" : ""}{(data.oa - data.cr).toFixed(1)}pp
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TimelineChart({
  timeline,
  publishers,
  mandates,
  highlightYear,
}) {
  const [showSource, setShowSource] = useState("both");
  const [fieldsMode, setFieldsMode] = useState("voluntary"); // all | voluntary
  const [selectedPubs, setSelectedPubs] = useState(() => new Set());
  // under 640px the labels of the events overlap whatever their rows: the lines stay, the names are on About
  const narrow = typeof window !== "undefined" && window.innerWidth < 640;

  const years = Object.keys(timeline).map(Number).sort();
  const chartData = years.map((year) => {
    const row = { year };
    const yearData = timeline[year];

    // Aggregate lines (always shown)
    if (fieldsMode === "voluntary") {
      const active = Object.values(yearData.publishers).filter(
        (p) => p.count > 0 && p.voluntaryCr != null,
      );
      if (active.length > 0) {
        row.aggregate_cr = +(active.reduce((s, p) => s + p.voluntaryCr, 0) / active.length * 100).toFixed(1);
        row.aggregate_oa = +(active.reduce((s, p) => s + p.voluntaryOa, 0) / active.length * 100).toFixed(1);
      }
    } else if (yearData.overall) {
      row.aggregate_cr = +(yearData.overall.crossref * 100).toFixed(1);
      row.aggregate_oa = +(yearData.overall.openalex * 100).toFixed(1);
    }

    // Individual publisher lines
    for (const pub of publishers) {
      if (!selectedPubs.has(pub.id)) continue;
      const pd = yearData.publishers[pub.id];
      if (pd && pd.count > 0) {
        if (fieldsMode === "voluntary" && pd.voluntaryCr != null) {
          row[`${pub.id}_cr`] = +(pd.voluntaryCr * 100).toFixed(1);
          row[`${pub.id}_oa`] = +(pd.voluntaryOa * 100).toFixed(1);
        } else {
          row[`${pub.id}_cr`] = +(pd.crossref * 100).toFixed(1);
          row[`${pub.id}_oa`] = +(pd.openalex * 100).toFixed(1);
        }
      }
    }
    return row;
  });

  const togglePub = (id) => {
    setSelectedPubs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="rounded-lg p-4 fade-in"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Completeness Over Time</h3>
          <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            {showSource === "both" && (
              <>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="3"><line x1="0" y1="1.5" x2="16" y2="1.5" stroke="var(--color-chart-aggregate)" strokeWidth="3" /></svg>
                  Aggregate (CR)
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="3"><line x1="0" y1="1.5" x2="16" y2="1.5" stroke="var(--color-chart-aggregate)" strokeWidth="3" strokeDasharray="4 2" /></svg>
                  Aggregate (OA)
                </span>
                <span style={{ color: "var(--color-border)" }}>|</span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--color-text-muted)" strokeWidth="2" /></svg>
                  Crossref
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--color-text-muted)" strokeWidth="2" strokeDasharray="4 2" /></svg>
                  OpenAlex
                </span>
                <span style={{ color: "var(--color-border)" }}>|</span>
              </>
            )}
            <button
              onClick={() => setFieldsMode(fieldsMode === "voluntary" ? "all" : "voluntary")}
              className="px-2 py-0.5 rounded-full font-medium"
              style={{
                fontSize: 10,
                background: fieldsMode === "voluntary" ? "var(--color-voluntary-dim)" : "var(--color-surface-alt)",
                color: fieldsMode === "voluntary" ? "var(--color-voluntary)" : "var(--color-text-muted)",
                border: fieldsMode === "voluntary" ? "1px solid var(--color-voluntary)" : "1px solid transparent",
              }}
            >
              Voluntary only
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {["crossref", "openalex", "both"].map((s) => (
            <button
              key={s}
              onClick={() => setShowSource(s)}
              className="px-3 py-1 text-xs rounded-full font-medium transition-colors"
              style={{
                background:
                  showSource === s
                    ? "var(--color-accent-dim)"
                    : "var(--color-surface-alt)",
                color:
                  showSource === s
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
              }}
            >
              {s === "both"
                ? "Both"
                : s === "crossref"
                  ? "Crossref"
                  : "OpenAlex"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: narrow ? 8 : 34, right: narrow ? 8 : 28, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" strokeOpacity={0.5} />
          <XAxis
            dataKey="year"
            stroke="var(--color-text-muted)"
            fontSize={12}
          />
          <YAxis
            stroke="var(--color-text-muted)"
            fontSize={12}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Highlight selected year */}
          {highlightYear && (
            <ReferenceLine
              x={highlightYear}
              stroke="var(--color-accent)"
              strokeWidth={2}
              strokeDasharray="none"
            />
          )}

          {/* Mandate reference lines */}
          {mandates.map((m, i) => (
            <ReferenceLine
              key={m.year}
              x={m.year}
              stroke="var(--color-text-muted)"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={narrow ? undefined : ({ viewBox }) => (
                // two rows, alternating, so that the labels of neighbouring years do not overlap
                <text
                  x={viewBox.x}
                  y={viewBox.y - 6 - (i % 2) * 13}
                  textAnchor="middle"
                  fill="var(--color-text-muted)"
                  fontSize={10}
                >
                  {m.label}
                </text>
              )}
            />
          ))}

          {/* Aggregate lines (always visible) */}
          {(showSource === "crossref" || showSource === "both") && (
            <Line
              dataKey="aggregate_cr"
              name="All Publishers (CR)"
              stroke="var(--color-chart-aggregate)"
              strokeWidth={3}
              dot={false}
              connectNulls
            />
          )}
          {(showSource === "openalex" || showSource === "both") && (
            <Line
              dataKey="aggregate_oa"
              name="All Publishers (OA)"
              stroke="var(--color-chart-aggregate)"
              strokeWidth={3}
              dot={false}
              strokeDasharray="6 3"
              connectNulls
            />
          )}

          {/* Individual publisher lines */}
          {publishers
            .filter((p) => selectedPubs.has(p.id))
            .map((pub) => (
              <React.Fragment key={pub.id}>
                {(showSource === "crossref" || showSource === "both") && (
                  <Line
                    dataKey={`${pub.id}_cr`}
                    name={`${pub.label} (CR)`}
                    stroke={PUBLISHER_COLORS[pub.id] || "var(--color-text-muted)"}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                )}
                {(showSource === "openalex" || showSource === "both") && (
                  <Line
                    dataKey={`${pub.id}_oa`}
                    name={`${pub.label} (OA)`}
                    stroke={PUBLISHER_COLORS[pub.id] || "var(--color-text-muted)"}
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="6 3"
                    connectNulls
                  />
                )}
              </React.Fragment>
            ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
        Share of the fields present in a publisher's records, mean of the publishers, by year of publication.
        Dashed vertical lines: the events of the timeline on the About page, in the year of each.
      </p>

      {/* Publisher toggle chips */}
      <div className="flex flex-wrap gap-2 mt-4 items-center">
        <span className="text-xs mr-1" style={{ color: "var(--color-text-muted)" }}>Compare:</span>
        <button
          onClick={() =>
            setSelectedPubs((prev) =>
              prev.size === publishers.length
                ? new Set()
                : new Set(publishers.map((p) => p.id)),
            )
          }
          className="px-2 py-1 text-xs rounded-full font-medium"
          style={{
            background: "var(--color-surface-alt)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          {selectedPubs.size === publishers.length ? "Clear all" : "Select all"}
        </button>
        {publishers.map((pub) => (
          <button
            key={pub.id}
            onClick={() => togglePub(pub.id)}
            className="px-2 py-1 text-xs rounded-full font-medium transition-opacity"
            style={{
              background: selectedPubs.has(pub.id)
                ? PUBLISHER_COLORS[pub.id] || "var(--color-text-muted)"
                : "var(--color-surface-alt)",
              color: selectedPubs.has(pub.id)
                ? "#fff"
                : "var(--color-text-muted)",
              opacity: selectedPubs.has(pub.id) ? 1 : 0.5,
            }}
          >
            {pub.label}
          </button>
        ))}
      </div>
    </div>
  );
}
