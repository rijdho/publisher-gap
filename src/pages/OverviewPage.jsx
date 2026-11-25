import { useState, useMemo } from "react";
import useGapData from "../hooks/useGapData";
import StatsCards from "../components/dashboard/StatsCards";
import TimelineChart from "../components/dashboard/TimelineChart";
import GapHeatmap from "../components/dashboard/GapHeatmap";
import PublisherRankingTable from "../components/dashboard/PublisherRankingTable";
import YearSlider from "../components/shared/YearSlider";

export default function OverviewPage() {
  const { data, loading, error } = useGapData();
  const [selectedYear, setSelectedYear] = useState("all"); // "all" or number

  const years = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.timeline).map(Number).sort();
  }, [data]);

  const isAll = selectedYear === "all";
  const currentYear = isAll ? null : selectedYear;

  // Publishers: aggregate or per-year
  const yearPublishers = useMemo(() => {
    if (!data) return [];
    if (isAll) {
      return data.publishers
        .filter((p) => p.totalWorksSampled > 0)
        .sort((a, b) => b.crossrefScore - a.crossrefScore);
    }
    const yearData = data.timeline[currentYear];
    if (!yearData) return [];
    return data.publishers
      .map((p) => {
        const yd = yearData.publishers[p.id];
        if (!yd || yd.count === 0) return null;
        return {
          ...p,
          crossrefScore: yd.crossref,
          openalexScore: yd.openalex,
          gap: yd.gap,
          totalWorksSampled: yd.count,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.crossrefScore - a.crossrefScore);
  }, [data, currentYear, isAll]);

  // Stats: aggregate or per-year
  const yearStats = useMemo(() => {
    if (!data) return null;
    if (isAll) return data.globalSummary;
    const yearData = data.timeline[currentYear];
    if (!yearData) return null;
    const activePubs = Object.values(yearData.publishers).filter(
      (p) => p.count > 0,
    );
    if (activePubs.length === 0) return null;
    return {
      totalPublishers: activePubs.length,
      totalWorks: activePubs.reduce((s, p) => s + p.count, 0),
      avgCrossrefScore:
        activePubs.reduce((s, p) => s + p.crossref, 0) / activePubs.length,
      avgOpenAlexScore:
        activePubs.reduce((s, p) => s + p.openalex, 0) / activePubs.length,
      avgGap:
        activePubs.reduce((s, p) => s + (p.openalex - p.crossref), 0) / activePubs.length,
    };
  }, [data, currentYear, isAll]);

  // Heatmap: aggregate or per-year
  const yearHeatmap = useMemo(() => {
    if (!data || !data.heatmap) return null;
    if (isAll) return data.heatmap; // Use the global aggregate heatmap
    const yearData = data.timeline[currentYear];
    if (!yearData) return null;
    const activePubs = data.heatmap.publishers.filter(
      (p) => yearData.publishers[p.id]?.count > 0,
    );
    const crossref = {};
    const openalex = {};
    for (const pub of activePubs) {
      const pd = yearData.publishers[pub.id];
      if (pd?.fields) {
        crossref[pub.id] = pd.fields.crossref;
        openalex[pub.id] = pd.fields.openalex;
      }
    }
    return { fields: data.heatmap.fields, publishers: activePubs, crossref, openalex };
  }, [data, currentYear, isAll]);

  if (loading) {
    return (
      <div
        className="text-center py-20"
        style={{ color: "var(--color-text-muted)" }}
      >
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--color-score-low)" }}>Error: {error}</p>
        <p
          className="text-sm mt-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Run the pipeline first: <code>npm run pipeline:all</code>
        </p>
      </div>
    );
  }

  const { globalSummary, publishers, timeline, mandates } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          Do Publishers Care About Metadata?
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Comparing what publishers deposit in Crossref vs what OpenAlex
          enriches. {globalSummary.totalWorks.toLocaleString()} works from{" "}
          {globalSummary.totalPublishers} publishers (2015-2025).
        </p>
      </div>

      {/* Key finding */}
      <div
        className="rounded-lg p-4"
        style={{
          background: `linear-gradient(135deg, var(--color-keyfinding-start), var(--color-keyfinding-end))`,
          border: "1px solid var(--color-keyfinding-border)",
        }}
      >
        <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-voluntary)" }}>
          Key Finding
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
          Publishers deposit only{" "}
          <strong style={{ color: "var(--color-crossref)" }}>
            {(globalSummary.avgCrossrefScore * 100).toFixed(0)}%
          </strong>{" "}
          of comparable metadata fields in Crossref. OpenAlex enriches this to{" "}
          <strong style={{ color: "var(--color-openalex)" }}>
            {(globalSummary.avgOpenAlexScore * 100).toFixed(0)}%
          </strong>{" "}
          (+{(globalSummary.avgGap * 100).toFixed(0)}pp), but much of this comes from
          external sources (ORCID, PubMed, Unpaywall), not from publishers improving their deposits.
          {globalSummary.avgVoluntaryCrossref != null && (
            <span style={{ color: "var(--color-voluntary)" }}>
              {" "}Over the {globalSummary.voluntaryFields} voluntary fields (those a publisher has to collect and deposit, as this page classifies them):{" "}
              {(globalSummary.avgVoluntaryCrossref * 100).toFixed(0)}% in the Crossref records and{" "}
              {(globalSummary.avgVoluntaryOpenAlex * 100).toFixed(0)}% in the OpenAlex records.
            </span>
          )}
        </p>
      </div>

      {/* Year selector */}
      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="text-xs font-medium uppercase tracking-wide mb-2"
          style={{ color: "var(--color-text-muted)" }}>
          Year
        </div>
        <YearSlider
          years={years}
          defaultAll={true}
          onYearChange={setSelectedYear}
        />
      </div>

      {yearStats && <StatsCards globalSummary={yearStats} year={isAll ? "All years" : currentYear} />}

      <TimelineChart
        timeline={timeline}
        publishers={publishers}
        mandates={mandates}
        highlightYear={currentYear}
      />

      {yearHeatmap && <GapHeatmap heatmap={yearHeatmap} year={isAll ? "All years" : currentYear} />}

      {yearPublishers.length > 0 && (
        <PublisherRankingTable publishers={yearPublishers} year={isAll ? "All years" : currentYear} />
      )}
    </div>
  );
}
