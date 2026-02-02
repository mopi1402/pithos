import { useEffect, useState } from "preact/hooks";
import type { SizeData } from "./types";

/**
 * Hook to fetch and manage size data from size-table.json.
 */
export function useSizeData() {
  const [data, setData] = useState<SizeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("size-table.json")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as SizeData;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading };
}

/**
 * Hook to detect the number of columns to display based on screen width.
 */
export function useColumnCount(): number {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumnCount = () => {
      if (window.matchMedia("(max-width: 1000px)").matches) {
        setColumnCount(1);
      } else if (window.matchMedia("(max-width: 1400px)").matches) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  return columnCount;
}
