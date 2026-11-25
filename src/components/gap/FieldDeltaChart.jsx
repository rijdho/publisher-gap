import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function FieldDeltaChart({ fieldSummary }) {
  if (!fieldSummary) return null;

  const chartData = fieldSummary
    .map((f) => ({
      id: f.id,
      label: f.label,
      category: f.category,
      gap: +(f.gap * 100).toFixed(1),
    }))
    .sort((a, b) => b.gap - a.gap);

  return (
    <div
      className="rounded-lg p-4 fade-in"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3 className="text-lg font-semibold mb-2">
        OpenAlex Enrichment by Field
      </h3>
      <p
        className="text-xs mb-4"
        style={{ color: "var(--color-text-muted)" }}
      >
        Positive = OpenAlex has more data than Crossref. Negative = Crossref has
        more.
      </p>

      <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 22)}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 140 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" strokeOpacity={0.5} />
          <XAxis
            type="number"
            stroke="var(--color-text-muted)"
            fontSize={11}
            tickFormatter={(v) => `${v}pp`}
          />
          <YAxis
            type="category"
            dataKey="label"
            stroke="var(--color-text-muted)"
            fontSize={11}
            width={130}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
            }}
            formatter={(v) => [`${v}pp`, "Gap"]}
          />
          <Bar dataKey="gap" radius={[0, 3, 3, 0]} stroke="var(--color-border)" strokeWidth={0.5}>
            {chartData.map((entry) => (
              <Cell
                key={entry.id}
                fill={
                  entry.gap > 0
                    ? "var(--color-gap-positive)"
                    : "var(--color-gap-negative)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
