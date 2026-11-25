import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CATEGORY_ORDER, CATEGORIES } from "../../lib/categories";

export default function SourceComparison({ publishers, gapAnalysis }) {
  const [selected, setSelected] = useState(publishers[0]?.id || "");

  if (!gapAnalysis) return null;

  // Build radar data by category
  const radarData = CATEGORY_ORDER.map((catId) => {
    const catInfo = CATEGORIES[catId];
    const fields = Object.entries(gapAnalysis.byField).filter(
      ([, v]) => v.category === catId,
    );

    const crAvg =
      fields.reduce(
        (s, [, v]) => s + (v.publishers[selected]?.crossref || 0),
        0,
      ) / (fields.length || 1);
    const oaAvg =
      fields.reduce(
        (s, [, v]) => s + (v.publishers[selected]?.openalex || 0),
        0,
      ) / (fields.length || 1);

    return {
      category: catInfo.label,
      Crossref: +(crAvg * 100).toFixed(1),
      OpenAlex: +(oaAvg * 100).toFixed(1),
    };
  });

  return (
    <div
      className="rounded-lg p-4 fade-in"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Crossref vs OpenAlex by Category
        </h3>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg"
          style={{
            background: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
          />
          <Radar
            name="Crossref"
            dataKey="Crossref"
            stroke="var(--color-crossref)"
            fill="var(--color-crossref)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="OpenAlex"
            dataKey="OpenAlex"
            stroke="var(--color-openalex)"
            fill="var(--color-openalex)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
