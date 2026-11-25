import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import useGapData from "../hooks/useGapData";
import SourceComparison from "../components/gap/SourceComparison";
import YearSlider from "../components/shared/YearSlider";
import { CATEGORY_ORDER, CATEGORIES, ENRICHMENT_NOTES } from "../lib/categories";

// Fields that only exist in one source (gap is structural, not publisher-driven)
const NON_COMPARABLE_IDS = new Set([
  "published_print_date", "published_online_date", "article_number",
  "update_policy", "jats_abstract", "assertions", "archive",
  "credit_roles", "data_availability", "peer_review_info",
  "clinical_trial", "abstract_structured",
]);

export default function GapAnalysisPage() {
  const { data, loading, error } = useGapData();
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("findable_essential");
  const [showOnlyComparable, setShowOnlyComparable] = useState(true);
  const [effortFilter, setEffortFilter] = useState("voluntary"); // all | voluntary

  const years = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.timeline).map(Number).sort();
  }, [data]);

  const isAll = selectedYear === "all";
  const currentYear = isAll ? null : selectedYear;

  // Build field-over-time chart data for selected category
  const fieldTimelineData = useMemo(() => {
    if (!data) return [];
    const fields = data.fieldSummary.filter(
      (f) => f.category === selectedCategory,
    );
    return years.map((year) => {
      const row = { year };
      const yearData = data.timeline[year];
      if (yearData?.fields) {
        for (const field of fields) {
          const crValue = yearData.fields[field.id]?.crossref;
          const oaValue = yearData.fields[field.id]?.openalex;
          if (crValue != null) {
            row[`${field.id}_cr`] = +(crValue * 100).toFixed(1);
          }
          if (oaValue != null) {
            row[`${field.id}_oa`] = +(oaValue * 100).toFixed(1);
          }
        }
      }
      return row;
    });
  }, [data, years, selectedCategory]);

  // Category scores over time
  const categoryTimelineData = useMemo(() => {
    if (!data) return [];
    return years.map((year) => {
      const row = { year };
      const yearData = data.timeline[year];
      if (yearData?.categories) {
        for (const catId of CATEGORY_ORDER) {
          const cd = yearData.categories[catId];
          if (cd) {
            row[`${catId}_cr`] = +(cd.crossref * 100).toFixed(1);
            row[`${catId}_oa`] = +(cd.openalex * 100).toFixed(1);
          }
        }
      }
      return row;
    });
  }, [data, years]);

  // Field deltas: aggregate or per-year, filter non-comparable if toggle is on
  const yearFieldDeltas = useMemo(() => {
    if (!data) return [];

    if (isAll) {
      // Use global field summary: always exclude non-comparable
      return data.fieldSummary
        .filter((f) => !NON_COMPARABLE_IDS.has(f.id))
        .filter((f) => effortFilter === "all" || f.effort === effortFilter)
        .map((f) => ({
          ...f,
          crossref: f.avgCrossref,
          openalex: f.avgOpenAlex,
          gap: f.gap,
          isComparable: true,
          effort: f.effort || "automatic",
        }))
        .sort((a, b) => b.gap - a.gap);
    }

    if (!data.timeline[currentYear]?.fields) return [];
    const yearFields = data.timeline[currentYear].fields;
    return data.fieldSummary
      .map((f) => {
        if (NON_COMPARABLE_IDS.has(f.id)) return null;
        const effort = f?.effort || "automatic";
        if (effortFilter !== "all" && effort !== effortFilter) return null;
        const crValue = yearFields[f.id]?.crossref;
        const oaValue = yearFields[f.id]?.openalex;
        if (crValue == null || oaValue == null) return null;
        return {
          ...f,
          crossref: crValue,
          openalex: oaValue,
          gap: oaValue - crValue,
          isComparable: true,
          effort,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.gap - a.gap);
  }, [data, currentYear, isAll, effortFilter]);

  // Max absolute gap for proper scaling
  const maxGap = useMemo(() => {
    if (yearFieldDeltas.length === 0) return 0.5;
    return Math.max(...yearFieldDeltas.map((f) => Math.abs(f.gap)), 0.1);
  }, [yearFieldDeltas]);

  const categoryFields = useMemo(() => {
    if (!data) return [];
    return data.fieldSummary.filter((f) => f.category === selectedCategory);
  }, [data, selectedCategory]);

  if (loading) {
    return (
      <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20" style={{ color: "var(--color-score-low)" }}>
        Error: {error}
      </div>
    );
  }

  const { publishers, fieldSummary, gapAnalysis, mandates } = data;
  const FIELD_COLORS = [
    "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899",
    "#14b8a6", "#f97316", "#6366f1", "#84cc16", "#06b6d4", "#e11d48",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Gap Analysis Over Time</h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          The difference between the Crossref records and the OpenAlex records of the same articles, year by year.
        </p>
      </div>

      {/* 1. Category scores over time: both sources */}
      <div
        className="rounded-lg p-4 fade-in"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <h3 className="text-lg font-semibold">Category Scores Over Time</h3>
        <div className="flex items-center gap-4 mt-1 mb-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span>Score by group of fields, mean of the publishers. The grouping is the author's.</span>
          <span className="flex items-center gap-1.5">
            <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--color-text-muted)" strokeWidth="2" /></svg>
            Crossref (solid)
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke="var(--color-text-muted)" strokeWidth="2" strokeDasharray="4 2" /></svg>
            OpenAlex (dashed)
          </span>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={categoryTimelineData}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" strokeOpacity={0.5} />
            <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8 }}
              formatter={(v) => `${v}%`}
            />
            <Legend />
            {mandates.map((m) => (
              <ReferenceLine key={m.year} x={m.year} stroke="var(--color-text-muted)" strokeDasharray="4 4" strokeWidth={1} />
            ))}
            {CATEGORY_ORDER.map((catId) => (
              <React.Fragment key={catId}>
                <Line
                  dataKey={`${catId}_cr`}
                  name={`${CATEGORIES[catId].label} (CR)`}
                  stroke={CATEGORIES[catId].colorLight}
                  strokeWidth={2}
                  dot={{ r: 2, strokeWidth: 1.5, fill: "var(--color-surface)" }}
                  connectNulls
                />
                <Line
                  dataKey={`${catId}_oa`}
                  name={`${CATEGORIES[catId].label} (OA)`}
                  stroke={CATEGORIES[catId].colorLight}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  connectNulls
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Field-level timeline by category */}
      <div
        className="rounded-lg p-4 fade-in"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Field Completeness Over Time</h3>
          <div className="flex flex-wrap gap-1">
            {CATEGORY_ORDER.map((catId) => (
              <button
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className="px-3 py-1 text-xs rounded-full font-medium"
                style={{
                  background: selectedCategory === catId ? `color-mix(in srgb, ${CATEGORIES[catId].colorLight} 18%, transparent)` : "var(--color-surface-alt)",
                  color: selectedCategory === catId ? CATEGORIES[catId].colorLight : "var(--color-text-muted)",
                  border: selectedCategory === catId ? `1px solid ${CATEGORIES[catId].colorLight}` : "1px solid transparent",
                }}
              >
                {CATEGORIES[catId].label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
          Percentage of Crossref records with each field of the selected group, mean of the publishers. Select a group above.
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={fieldTimelineData}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" strokeOpacity={0.5} />
            <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8 }}
              formatter={(v) => `${v}%`}
            />
            <Legend />
            {mandates.map((m) => (
              <ReferenceLine key={m.year} x={m.year} stroke="var(--color-text-muted)" strokeDasharray="4 4" strokeWidth={1} />
            ))}
            {categoryFields.map((field, i) => (
              <Line
                key={field.id}
                dataKey={`${field.id}_cr`}
                name={field.label}
                stroke={FIELD_COLORS[i % FIELD_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 2, strokeWidth: 1.5, fill: "var(--color-surface)" }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Field Gap Snapshot (fixed scaling) */}
      <div
        className="rounded-lg p-4 fade-in"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Difference by Field: OpenAlex less Crossref</h3>
          <button
            onClick={() => setEffortFilter(effortFilter === "voluntary" ? "all" : "voluntary")}
            className="px-2 py-1 rounded-full font-medium"
            style={{
              fontSize: 10,
              background: effortFilter === "voluntary" ? "var(--color-voluntary-dim)" : "var(--color-surface-alt)",
              color: effortFilter === "voluntary" ? "var(--color-voluntary)" : "var(--color-text-muted)",
              border: effortFilter === "voluntary" ? "1px solid var(--color-voluntary)" : "1px solid transparent",
            }}
          >
            Voluntary only
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          Per-field difference: OpenAlex minus Crossref. Green = more OpenAlex records have the field.
          Red = more Crossref records have it. Center line = no difference.
          Fields marked <span style={{ color: "var(--color-voluntary)" }}>&#9679;</span> are those this page classifies as voluntary;
          fields marked <span style={{ color: "var(--color-automatic-indicator)" }}>&#9679;</span> as automatic. The classification is the author's (see About).
        </p>
        <YearSlider years={years} defaultAll={true} onYearChange={setSelectedYear} />

        <div className="mt-4 space-y-1">
          {yearFieldDeltas.map((f) => {
            // Scale bars relative to max gap so they never overflow
            const barPct = maxGap > 0 ? (Math.abs(f.gap) / maxGap) * 50 : 0;
            return (
              <div key={f.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-44 truncate text-right flex-shrink-0 flex items-center justify-end gap-1"
                  style={{
                    color: CATEGORIES[f.category]?.colorLight || "var(--color-text-muted)",
                    opacity: f.isComparable ? 1 : 0.5,
                  }}
                  title={ENRICHMENT_NOTES[f.id] || undefined}
                >
                  <span
                    style={{
                      color: f.effort === "voluntary" ? "var(--color-voluntary)" : "var(--color-automatic-indicator)",
                      fontSize: 8,
                    }}
                  >
                    &#9679;
                  </span>
                  {f.label}
                  {ENRICHMENT_NOTES[f.id] && (
                    <span style={{ color: "var(--color-enrichment)", fontSize: 10 }}>*</span>
                  )}
                </div>
                <div
                  className="flex-1 h-4 relative rounded overflow-hidden"
                  style={{ background: "var(--color-surface-alt)" }}
                >
                  {/* Center line */}
                  <div
                    className="absolute h-full w-px z-10"
                    style={{ left: "50%", background: "var(--color-text-muted)" }}
                  />
                  {/* Bar */}
                  <div
                    className="absolute h-full rounded"
                    style={{
                      width: `${Math.min(barPct, 50)}%`,
                      left: f.gap >= 0 ? "50%" : `${50 - Math.min(barPct, 50)}%`,
                      background: f.gap > 0
                        ? "var(--color-gap-positive)"
                        : "var(--color-gap-negative)",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <div
                  className="w-16 text-right font-mono flex-shrink-0"
                  style={{
                    color: f.gap > 0.02
                      ? "var(--color-gap-positive)"
                      : f.gap < -0.02
                        ? "var(--color-gap-negative)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {f.gap > 0 ? "+" : ""}
                  {(f.gap * 100).toFixed(1)}pp
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Radar + Enrichment matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SourceComparison publishers={publishers} gapAnalysis={gapAnalysis} />
          <p className="text-xs mt-2 px-1" style={{ color: "var(--color-text-muted)" }}>
            Radar comparing average Crossref vs OpenAlex scores by category for the selected publisher.
          </p>
        </div>

        <div
          className="rounded-lg p-4 fade-in"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <h3 className="text-lg font-semibold">Fields the OpenAlex Records Have More Often</h3>
          <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
            Green badges: fields that the OpenAlex records have more often than the Crossref records, by more than 5 percentage points.
          </p>
          <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
            The page does not tell where OpenAlex took a value from.
          </p>
          <div className="space-y-3">
            {CATEGORY_ORDER.map((catId) => {
              const cat = CATEGORIES[catId];
              const fields = fieldSummary.filter((f) => f.category === catId && !NON_COMPARABLE_IDS.has(f.id));
              const enriched = fields.filter((f) => f.gap > 0.05);
              const noHelp = fields.filter((f) => f.gap <= 0.02 && f.avgOpenAlex < 0.1);

              return (
                <div key={catId}>
                  <div
                    className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: cat.colorLight }}
                  >
                    {cat.label}
                  </div>
                  {enriched.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {enriched.map((f) => (
                        <span
                          key={f.id}
                          className="text-xs px-2 py-0.5 rounded-full cursor-help"
                          style={{ background: "color-mix(in srgb, var(--color-gap-positive) 15%, transparent)", color: "var(--color-gap-positive)" }}
                          title={ENRICHMENT_NOTES[f.id] || undefined}
                        >
                          {f.label} +{(f.gap * 100).toFixed(0)}pp
                        </span>
                      ))}
                    </div>
                  )}
                  {noHelp.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {noHelp.map((f) => (
                        <span
                          key={f.id}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "color-mix(in srgb, var(--color-gap-negative) 10%, transparent)", color: "var(--color-gap-negative)" }}
                        >
                          {f.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
