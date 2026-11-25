import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import usePublisherDetail from "../hooks/usePublisherDetail";
import { CATEGORIES, CATEGORY_ORDER } from "../lib/categories";

const NON_COMPARABLE_IDS = new Set([
  "article_number", "update_policy", "jats_abstract", "assertions", "archive",
  "credit_roles", "data_availability", "peer_review_info",
  "clinical_trial", "abstract_structured",
]);

export default function PublisherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = usePublisherDetail(id);
  const [fieldsMode, setFieldsMode] = useState("voluntary");
  const [expandedField, setExpandedField] = useState(null);

  if (loading) {
    return (
      <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20" style={{ color: "var(--color-score-low)" }}>
        {error || "Publisher not found"}
      </div>
    );
  }

  // Use comparable scores
  const crScore = data.comparable?.crossref?.overall ?? data.crossref.overall;
  const oaScore = data.comparable?.openalex?.overall ?? data.openalex.overall;
  const gap = oaScore - crScore;

  // Use comparable category scores
  const crCats = data.comparable?.crossref?.categories ?? data.crossref.categories;
  const oaCats = data.comparable?.openalex?.categories ?? data.openalex.categories;

  // Trend data using comparable scores
  const trendData = data.yearlyScores.map((y) => {
    if (fieldsMode === "voluntary" && y.voluntary) {
      return {
        year: y.year,
        Crossref: +(y.voluntary.crossref * 100).toFixed(1),
        OpenAlex: +(y.voluntary.openalex * 100).toFixed(1),
      };
    }
    const cr = y.comparable?.crossref?.overall ?? y.crossref.overall;
    const oa = y.comparable?.openalex?.overall ?? y.openalex.overall;
    return {
      year: y.year,
      Crossref: +(cr * 100).toFixed(1),
      OpenAlex: +(oa * 100).toFixed(1),
    };
  });

  // Filter fields: only comparable, optionally only voluntary
  const filteredFields = (data.fieldDetails || []).filter((f) => {
    if (NON_COMPARABLE_IDS.has(f.id)) return false;
    if (fieldsMode === "voluntary") return f.effort === "voluntary";
    return true;
  });

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm hover:underline"
        style={{ color: "var(--color-accent)" }}
      >
        &larr; Back
      </button>

      <div>
        <h2 className="text-2xl font-bold">{data.label}</h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {data.categoryLabel} &middot;{" "}
          {data.totalWorksSampled.toLocaleString()} works sampled (of{" "}
          {data.totalWorksUniverse.toLocaleString()} total)
        </p>
      </div>

      {/* Score cards: comparable */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg px-3 py-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }} className="uppercase">Crossref Score</div>
          <div className="text-xl font-bold" style={{ color: "var(--color-crossref)" }}>
            {(crScore * 100).toFixed(1)}%
          </div>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }}>comparable fields</div>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }} className="uppercase">OpenAlex Score</div>
          <div className="text-xl font-bold" style={{ color: "var(--color-openalex)" }}>
            {(oaScore * 100).toFixed(1)}%
          </div>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }}>comparable fields</div>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }} className="uppercase">Gap</div>
          <div className="text-xl font-bold" style={{ color: gap > 0 ? "var(--color-gap-positive)" : "var(--color-gap-negative)" }}>
            {gap > 0 ? "+" : ""}{(gap * 100).toFixed(1)}pp
          </div>
          <div style={{ color: "var(--color-text-muted)", fontSize: 10 }}>OpenAlex less Crossref</div>
        </div>
      </div>

      {/* Category scores: comparable */}
      <div className="rounded-lg p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-lg font-semibold mb-3">Scores by Category</h3>
        <div className="space-y-2">
          {CATEGORY_ORDER.map((catId) => {
            const cat = CATEGORIES[catId];
            const cr = crCats[catId] || 0;
            const oa = oaCats[catId] || 0;
            return (
              <div key={catId} className="flex items-center gap-3">
                <div className="w-36 text-xs font-medium" style={{ color: cat.colorLight }}>
                  {cat.label}
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--color-surface-alt)" }}>
                    <div className="h-full rounded-full" style={{ width: `${cr * 100}%`, background: "var(--color-crossref)" }} />
                  </div>
                  <span className="text-xs font-mono w-12 text-right" style={{ color: "var(--color-crossref)" }}>
                    {(cr * 100).toFixed(0)}%
                  </span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--color-surface-alt)" }}>
                    <div className="h-full rounded-full" style={{ width: `${oa * 100}%`, background: "var(--color-openalex)" }} />
                  </div>
                  <span className="text-xs font-mono w-12 text-right" style={{ color: "var(--color-openalex)" }}>
                    {(oa * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yearly trend: with voluntary toggle */}
      <div className="rounded-lg p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Yearly Trend</h3>
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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" strokeOpacity={0.5} />
            <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={12} />
            <YAxis stroke="var(--color-text-muted)" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8 }}
              formatter={(v) => `${v}%`}
            />
            <Legend />
            <Line dataKey="Crossref" stroke="var(--color-crossref)" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: "var(--color-surface)" }} />
            <Line dataKey="OpenAlex" stroke="var(--color-openalex)" strokeWidth={2} dot={{ r: 3, strokeWidth: 1.5, fill: "var(--color-surface)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Field detail table: only comparable */}
      <div className="rounded-lg p-4 overflow-x-auto" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Field-by-Field Detail</h3>
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
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th className="text-left py-2 px-3" style={{ color: "var(--color-text-muted)" }}>Field</th>
              <th className="text-right py-2 px-3" style={{ color: "var(--color-crossref)" }}>Crossref</th>
              <th className="text-right py-2 px-3" style={{ color: "var(--color-openalex)" }}>OpenAlex</th>
              <th className="text-right py-2 px-3" style={{ color: "var(--color-text-muted)" }}>Gap</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((f) => {
              const hasSamples = f.samples && f.samples.length > 0;
              const isExpanded = expandedField === f.id;
              return (
                <React.Fragment key={f.id}>
                  <tr
                    style={{ borderBottom: "1px solid var(--color-border)", cursor: hasSamples ? "pointer" : "default" }}
                    onClick={() => hasSamples && setExpandedField(isExpanded ? null : f.id)}
                  >
                    <td className="py-1.5 px-3">
                      <span className="text-xs" style={{ color: CATEGORIES[f.category]?.colorLight || "var(--color-text)" }}>
                        {f.label}
                        {hasSamples && <span style={{ color: "var(--color-text-muted)", fontSize: 9 }}> ({f.samples.length})</span>}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono text-xs">
                      {(f.crossref * 100).toFixed(1)}%
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono text-xs">
                      {(f.openalex * 100).toFixed(1)}%
                    </td>
                    <td className="py-1.5 px-3 text-right font-mono text-xs" style={{
                      color: f.gap > 0.02 ? "var(--color-gap-positive)" : f.gap < -0.02 ? "var(--color-gap-negative)" : "var(--color-text-muted)",
                    }}>
                      {f.gap > 0 ? "+" : ""}{(f.gap * 100).toFixed(1)}pp
                    </td>
                  </tr>
                  {isExpanded && f.samples.map((s, i) => (
                    <tr key={`${f.id}-${i}`} style={{ background: "var(--color-surface-alt)" }}>
                      <td className="py-1 px-3 text-xs" style={{ color: "var(--color-text-muted)" }} colSpan={2}>
                        <span className="line-clamp-1">{s.title}</span>
                      </td>
                      <td className="py-1 px-2 text-center" colSpan={2}>
                        <span className="flex gap-2 justify-end text-xs">
                          <a href={`https://doi.org/${s.doi}`} target="_blank" rel="noopener noreferrer"
                            className="hover:underline" style={{ color: "var(--color-accent)" }}>DOI</a>
                          <a href={`https://api.crossref.org/works/${s.doi}`} target="_blank" rel="noopener noreferrer"
                            className="hover:underline" style={{ color: "var(--color-crossref)" }}>CR</a>
                          <a href={`https://api.openalex.org/works/doi:${s.doi}`} target="_blank" rel="noopener noreferrer"
                            className="hover:underline" style={{ color: "var(--color-openalex)" }}>OA</a>
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sample works */}
      {data.sampleWorks && data.sampleWorks.length > 0 && (
        <div className="rounded-lg p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-lg font-semibold mb-3">Sample Works with Largest Gaps</h3>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
            For each article: the share of the 26 compared fields present in its Crossref record (CR) and in its OpenAlex record (OA), and how many fields only the OpenAlex record has.
          </p>
          <div className="space-y-3">
            {data.sampleWorks.map((w, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: "var(--color-surface-alt)" }}>
                <a href={`https://doi.org/${w.doi}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline" style={{ color: "var(--color-accent)" }}>
                  {w.title}
                </a>
                <div className="flex gap-4 mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <span>{w.year}</span>
                  <span style={{ color: "var(--color-crossref)" }}>CR: {(w.crossrefScore * 100).toFixed(0)}%</span>
                  <span style={{ color: "var(--color-openalex)" }}>OA: {(w.openalexScore * 100).toFixed(0)}%</span>
                  <span>Gap: {w.gap} fields</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
