import { useState, useEffect } from "react";

export default function usePublisherDetail(publisherId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!publisherId) return;

    setLoading(true);
    setError(null);

    fetch(`./data/publisher-details/${publisherId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Publisher not found: ${publisherId}`);
        return r.json();
      })
      .then((detail) => {
        setData(detail);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [publisherId]);

  return { data, loading, error };
}
