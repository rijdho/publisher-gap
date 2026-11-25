export default function StatsCards({ globalSummary, year }) {
  const cards = [
    {
      label: "Articles",
      value: globalSummary.totalWorks.toLocaleString(),
      description: year ? `Journal articles read, ${year}` : "Journal articles read",
    },
    {
      label: "Publishers",
      value: globalSummary.totalPublishers,
      description: "Commercial hybrid, OA, and regional",
    },
    {
      label: "Crossref: voluntary fields",
      value: `${(globalSummary.avgVoluntaryCrossref * 100).toFixed(1)}%`,
      description: `Score of the Crossref records over the ${globalSummary.voluntaryFields} voluntary fields, mean of the publishers. All ${globalSummary.comparableFields} compared fields: ${(globalSummary.avgCrossrefScore * 100).toFixed(1)}%`,
      color: "var(--color-crossref)",
    },
    {
      label: "OpenAlex: voluntary fields",
      value: `${(globalSummary.avgVoluntaryOpenAlex * 100).toFixed(1)}%`,
      description: `The same score for the OpenAlex records of the same articles. All ${globalSummary.comparableFields} compared fields: ${(globalSummary.avgOpenAlexScore * 100).toFixed(1)}%`,
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
