import { useState, useCallback, useRef } from "react";
import { createLLMProxy, type ProxyStats } from "@/lib/llmProxy";

export function useLLMProxy() {
  const proxyRef = useRef(createLLMProxy());
  const [stats, setStats] = useState<ProxyStats>(() => ({ ...proxyRef.current.stats }));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAsk = useCallback(async (question: string) => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setLastResponse(null);

    const { entry, stats: next } = await proxyRef.current.ask(question);
    setStats(next);
    setLastResponse(entry.response);
    setInput("");
    setLoading(false);
    inputRef.current?.focus();
  }, [loading]);

  const handleReset = useCallback(() => {
    proxyRef.current = createLLMProxy();
    proxyRef.current.setSimulateFailure(simulateFailure);
    setStats({ ...proxyRef.current.stats });
    setLastResponse(null);
    setInput("");
  }, [simulateFailure]);

  const toggleFailure = useCallback(() => {
    setSimulateFailure((prev) => {
      const next = !prev;
      proxyRef.current.setSimulateFailure(next);
      return next;
    });
  }, []);

  const handleSpam = useCallback(async () => {
    if (loading) return;
    const question = "What is the capital of France?";
    for (let i = 0; i < 5; i++) {
      const { stats: next } = await proxyRef.current.ask(question);
      setStats({ ...next });
    }
    setLastResponse("Spam complete. Check the proxy log.");
  }, [loading]);

  return {
    stats,
    input,
    setInput,
    loading,
    lastResponse,
    simulateFailure,
    inputRef,
    handleAsk,
    handleReset,
    toggleFailure,
    handleSpam,
  };
}
