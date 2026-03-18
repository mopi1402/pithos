import { useState, useCallback } from "react";
import { buildPipeline, clearLog, clearCache, executionLog } from "@/lib/decorators";
import { SAMPLE_SEQUENCES } from "@/data/sequences";
import type { DecoratorOption, AnalysisResult, LogEntry } from "@/lib/types";

export function useAnalysisPipeline() {
  const [selectedDecorators, setSelectedDecorators] = useState<DecoratorOption[]>(["timing"]);
  const [selectedSequence, setSelectedSequence] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);

  const toggleDecorator = useCallback((decorator: DecoratorOption) => {
    setSelectedDecorators((prev) => prev.includes(decorator) ? prev.filter((d) => d !== decorator) : [...prev, decorator]);
  }, []);

  const runAnalysis = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    setError(null);
    clearLog();
    setLog([]);
    const pipeline = buildPipeline(selectedDecorators);
    const sequence = SAMPLE_SEQUENCES[selectedSequence].sequence;
    const logInterval = setInterval(() => setLog([...executionLog]), 50);
    try {
      setResult(await pipeline(sequence));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      clearInterval(logInterval);
      setLog([...executionLog]);
      setIsRunning(false);
    }
  }, [selectedDecorators, selectedSequence]);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
    clearLog();
    clearCache();
    setLog([]);
  }, []);

  return {
    selectedDecorators, selectedSequence, setSelectedSequence,
    isRunning, result, error, log,
    toggleDecorator, runAnalysis, handleReset,
  };
}
