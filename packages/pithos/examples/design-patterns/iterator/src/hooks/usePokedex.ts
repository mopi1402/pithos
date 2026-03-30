import { useState, useCallback, useRef, useEffect } from "react";
import { createPokedex, type SourceId, type Pokemon, type PokedexState } from "@/lib/pokedex";
import type { LogEntry } from "@/components/YieldLog";

export function usePokedex() {
  const [source, setSource] = useState<SourceId>("byIndex");
  const pokedexRef = useRef(createPokedex("byIndex"));
  const [state, setState] = useState<PokedexState>(pokedexRef.current.getState());
  const [lastAdded, setLastAdded] = useState<Map<number, number>>(new Map());
  const [log, setLog] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);
  const mobileLogScrollRef = useRef<HTMLDivElement>(null);
  const clearNewTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(clearNewTimerRef.current);
  }, []);

  const sync = useCallback(() => setState(pokedexRef.current.getState()), []);

  const markNew = useCallback((entries: Map<number, number>) => {
    clearTimeout(clearNewTimerRef.current);
    setLastAdded(entries);
    clearNewTimerRef.current = setTimeout(() => setLastAdded(new Map<number, number>()), 1000);
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      logScrollRef.current?.scrollTo({ top: logScrollRef.current.scrollHeight, behavior: "smooth" });
      mobileLogScrollRef.current?.scrollTo({ top: mobileLogScrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const addLog = useCallback((src: SourceId, pokemon: Pokemon | null) => {
    setLog((prev) => [
      ...prev,
      { id: ++logIdRef.current, source: src, pokemon: pokemon?.name ?? null, exhausted: !pokemon },
    ].slice(-50));
  }, []);

  const handleNext = useCallback(() => {
    const p = pokedexRef.current.next();
    addLog(source, p);
    if (p) markNew(new Map([[p.id, 0]]));
    sync();
    scrollToBottom();
  }, [sync, source, addLog, scrollToBottom, markNew]);

  const handleNextBatch = useCallback(() => {
    const batch = pokedexRef.current.nextBatch(5);
    for (const p of batch) addLog(source, p);
    if (!batch.length) addLog(source, null);
    if (batch.length) markNew(new Map(batch.map((p, i) => [p.id, i])));
    sync();
    scrollToBottom();
  }, [sync, source, addLog, scrollToBottom, markNew]);

  const resetState = useCallback((src: SourceId) => {
    pokedexRef.current = createPokedex(src);
    setState(pokedexRef.current.getState());
    setLastAdded(new Map());
    setLog([]);
    logIdRef.current = 0;
  }, []);

  const handleSourceChange = useCallback((id: SourceId) => {
    setSource(id);
    resetState(id);
  }, [resetState]);

  const handleReset = useCallback(() => {
    resetState(source);
  }, [source, resetState]);

  return {
    source,
    state,
    lastAdded,
    log,
    scrollRef,
    logScrollRef,
    mobileLogScrollRef,
    handleNext,
    handleNextBatch,
    handleSourceChange,
    handleReset,
  };
}
