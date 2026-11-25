import { useState, useEffect } from "react";

export default function useGapData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("./data/global-summary.json").then((r) => r.json()),
      fetch("./data/publishers.json").then((r) => r.json()),
      fetch("./data/field-summary.json").then((r) => r.json()),
      fetch("./data/timeline.json").then((r) => r.json()),
      fetch("./data/gap-analysis.json").then((r) => r.json()),
      fetch("./data/heatmap.json").then((r) => r.json()),
      fetch("./data/mandates.json").then((r) => r.json()),
    ])
      .then(
        ([
          globalSummary,
          publishers,
          fieldSummary,
          timeline,
          gapAnalysis,
          heatmap,
          mandates,
        ]) => {
          setData({
            globalSummary,
            publishers,
            fieldSummary,
            timeline,
            gapAnalysis,
            heatmap,
            mandates,
          });
          setLoading(false);
        },
      )
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
