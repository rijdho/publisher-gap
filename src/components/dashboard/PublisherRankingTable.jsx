import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "../../lib/publishers";

function ScoreBadge({ value, showPercent = true }) {
  const pct = value * 100;
  const color =
    pct >= 60
      ? "var(--color-score-high)"
      : pct >= 35
        ? "var(--color-score-mid)"
        : "var(--color-score-low)";
  return (
    <span className="font-mono text-sm font-semibold" style={{ color }}>
      {pct.toFixed(1)}
      {showPercent && "%"}
    </span>
  );
}

export default function PublisherRankingTable({ publishers }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("crossrefScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");

  const handleSort = (col) => {
    if (sortBy === col) setSortAsc(!sortAsc);
    else {
      setSortBy(col);
      setSortAsc(false);
    }
  };

  const filtered = publishers
    .filter((p) =>
      p.label.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      const diff = (a[sortBy] || 0) - (b[sortBy] || 0);
      return sortAsc ? diff : -diff;
    });

  const hasVoluntary = publishers[0]?.voluntaryCrossref != null;

  const columns = [
    { key: "label", label: "Publisher", sortable: false },
    { key: "category", label: "Type", sortable: false },
    { key: "crossrefScore", label: "Crossref" },
    { key: "openalexScore", label: "OpenAlex" },
    { key: "gap", label: "Gap" },
    ...(hasVoluntary
      ? [{ key: "voluntaryCrossref", label: "Voluntary (CR)" }]
      : []),
    { key: "totalWorksSampled", label: "Works" },
  ];

  return (
    <div
      className="rounded-lg p-4 fade-in"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Publisher Ranking</h3>
        <input
          type="text"
          placeholder="Search publisher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg"
          style={{
            background: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left py-2 px-3 font-medium ${col.sortable !== false ? "cursor-pointer hover:underline" : ""}`}
                  style={{ color: "var(--color-text-muted)" }}
                  onClick={
                    col.sortable !== false
                      ? () => handleSort(col.key)
                      : undefined
                  }
                >
                  {col.label}
                  {sortBy === col.key && (sortAsc ? " \u25B2" : " \u25BC")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((pub) => (
              <tr
                key={pub.id}
                className="cursor-pointer transition-colors"
                style={{ borderBottom: "1px solid var(--color-border)" }}
                onClick={() => navigate(`/publisher/${pub.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-surface-alt)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td className="py-2 px-3 font-medium">{pub.label}</td>
                <td className="py-2 px-3">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        CATEGORY_COLORS[pub.category] + "20",
                      color: CATEGORY_COLORS[pub.category],
                    }}
                  >
                    {CATEGORY_LABELS[pub.category] || pub.category}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <ScoreBadge value={pub.crossrefScore} />
                </td>
                <td className="py-2 px-3">
                  <ScoreBadge value={pub.openalexScore} />
                </td>
                <td className="py-2 px-3">
                  <span
                    className="font-mono text-sm"
                    style={{
                      color:
                        pub.gap > 0
                          ? "var(--color-gap-positive)"
                          : "var(--color-gap-negative)",
                    }}
                  >
                    {pub.gap > 0 ? "+" : ""}
                    {(pub.gap * 100).toFixed(1)}pp
                  </span>
                </td>
                {hasVoluntary && (
                  <td className="py-2 px-3">
                    <span
                      className="font-mono text-sm font-semibold"
                      style={{
                        color:
                          (pub.voluntaryCrossref || 0) > 0.3
                            ? "var(--color-score-mid)"
                            : "var(--color-score-low)",
                      }}
                    >
                      {pub.voluntaryCrossref != null
                        ? `${(pub.voluntaryCrossref * 100).toFixed(1)}%`
                        : "n/a"}
                    </span>
                  </td>
                )}
                <td
                  className="py-2 px-3 font-mono"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {pub.totalWorksSampled.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
