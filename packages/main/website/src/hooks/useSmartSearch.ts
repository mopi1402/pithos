/**
 * Hook for smart semantic search using Web Worker
 *
 * Features:
 * - Loads embedding model in Web Worker (doesn't block main thread)
 * - Falls back to text search while model loads
 * - Caches model in browser (Service Worker / IndexedDB)
 * - Debounces search queries
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface SearchResult {
  id: string;
  utilId: string;
  useCaseIndex: number;
  score: number;
}

interface EmbeddingEntry {
  id: string;
  text: string;
  utilId: string;
  useCaseIndex: number;
}

interface UseSmartSearchOptions {
  entries: EmbeddingEntry[];
  debounceMs?: number;
  topK?: number;
  minScore?: number;
}

interface UseSmartSearchReturn {
  search: (query: string) => void;
  results: SearchResult[];
  isModelReady: boolean;
  isSearching: boolean;
  loadingProgress: number;
  loadingStatus: string;
  error: string | null;
}

export function useSmartSearch({
  entries,
  debounceMs = 300,
  topK = 20,
  minScore = 0.3,
}: UseSmartSearchOptions): UseSmartSearchReturn {
  const workerRef = useRef<Worker | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchIdRef = useRef<number>(0);

  const [isModelReady, setIsModelReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize worker
  useEffect(() => {
    // Check if Web Workers are supported
    if (typeof Worker === "undefined") {
      setError("Web Workers not supported");
      return;
    }

    // Create worker
    try {
      // Dynamic import for the worker to work with bundlers
      workerRef.current = new Worker(
        new URL("../workers/embedding.worker.ts", import.meta.url),
        { type: "module" }
      );

      // Handle messages from worker
      workerRef.current.onmessage = (event) => {
        const { type, ...data } = event.data;

        switch (type) {
          case "ready":
            console.log("[useSmartSearch] Model ready");
            setIsModelReady(true);
            setLoadingStatus("Ready");
            // Send entries to worker for indexing
            workerRef.current?.postMessage({ type: "setEntries", entries });
            break;

          case "indexed":
            console.log(`[useSmartSearch] Indexed ${data.count} entries`);
            setLoadingStatus(`Indexed ${data.count} entries`);
            break;

          case "progress":
            setLoadingProgress(data.progress);
            setLoadingStatus(data.status);
            break;

          case "searchResult":
            // Ignore results from outdated searches
            if (data.searchId !== currentSearchIdRef.current) {
              console.log(`[useSmartSearch] Ignoring stale result (searchId=${data.searchId}, current=${currentSearchIdRef.current})`);
              return;
            }
            const filtered = data.results.filter((r: SearchResult) => r.score >= minScore);
            console.log(`[useSmartSearch] Received ${data.results.length} results, ${filtered.length} after minScore filter`);
            setResults(filtered);
            setIsSearching(false);
            break;

          case "error":
            console.error(`[useSmartSearch] Error: ${data.message}`);
            setError(data.message);
            setIsSearching(false);
            break;
        }
      };

      workerRef.current.onerror = (event) => {
        setError(`Worker error: ${event.message}`);
      };

      // Initialize model
      workerRef.current.postMessage({ type: "init" });
    } catch (err) {
      setError(`Failed to create worker: ${err instanceof Error ? err.message : String(err)}`);
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []); // Only run once on mount

  // Update entries when they change
  useEffect(() => {
    if (isModelReady && workerRef.current && entries.length > 0) {
      workerRef.current.postMessage({ type: "setEntries", entries });
    }
  }, [entries, isModelReady]);

  // Search function with debounce
  const search = useCallback(
    (query: string) => {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Empty query = clear results
      if (!query.trim()) {
        setResults([]);
        return;
      }

      // Debounce the search
      debounceRef.current = setTimeout(() => {
        if (!workerRef.current || !isModelReady) {
          // Fallback: text search if model not ready
          console.log(`[useSmartSearch] Fallback text search for "${query}"`);
          const lowerQuery = query.toLowerCase();
          const textResults = entries
            .filter((e) => e.text.toLowerCase().includes(lowerQuery))
            .map((e, i) => ({
              id: e.id,
              utilId: e.utilId,
              useCaseIndex: e.useCaseIndex,
              score: 1 - i * 0.01, // Fake score based on order
            }))
            .slice(0, topK);
          setResults(textResults);
          return;
        }

        // Increment search ID to track this search
        currentSearchIdRef.current += 1;
        const searchId = currentSearchIdRef.current;

        console.log(`[useSmartSearch] Starting search #${searchId} for "${query}"`);
        setIsSearching(true);
        workerRef.current.postMessage({ type: "search", query, topK, searchId });
      }, debounceMs);
    },
    [entries, isModelReady, debounceMs, topK]
  );

  return {
    search,
    results,
    isModelReady,
    isSearching,
    loadingProgress,
    loadingStatus,
    error,
  };
}
