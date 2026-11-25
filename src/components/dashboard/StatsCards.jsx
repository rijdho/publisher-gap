export default function StatsCards({ globalSummary, year }) {
  const cards = [
    {
      label: "Works Analyzed",
      value: globalSummary.totalWorks.toLocaleString(),
      description: year ? `Works analyzed in ${year}` : "Total works analyzed",
    },
    {
      label: "Publishers",
      value: globalSummary.totalPublishers,
      description: "Commercial hybrid, OA, and regional",
    },
    {
      label: "Crossref Score",
      value: `${(globalSummary.avgCrossrefScore * 100).toFixed(1)}%`,
      description: "What publishers deposit (comparable fields)",
      color: "var(--color-crossref)",
    },
    {
      label: "OpenAlex Gap",
      value: `+${(globalSummary.avgGap * 100).toFixed(1)}pp`,
      description: "What OpenAlex adds on top",
      color: "var(--color-openalex)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-in">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg px-3 py-2"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="font-medium uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)", fontSize: 10 }}
          >
            {card.label}
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: card.color || "var(--color-text)" }}
          >
            {card.value}
          </div>
          <div
            style={{ color: "var(--color-text-muted)", fontSize: 10 }}
          >
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
}
