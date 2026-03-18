import { useState, useCallback } from "react";
import { validateInput, buildAuthHeaders, serializeRequest, executeFetch, parseResponse, formatResult, fetchUser } from "@/lib/facade";
import { STEP_KEYS, makeInitialSteps } from "@/data/steps";
import type { User, StepState, Mode } from "@/lib/types";

export function useApiFacade() {
  const [mode, setMode] = useState<Mode>("expanded");
  const [userId, setUserId] = useState("42");
  const [steps, setSteps] = useState(makeInitialSteps);
  const [result, setResult] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [facadeDuration, setFacadeDuration] = useState<number | null>(null);
  const [totalExpandedDuration, setTotalExpandedDuration] = useState<number | null>(null);

  const reset = useCallback(() => {
    setSteps(makeInitialSteps());
    setResult(null);
    setError(null);
    setFacadeDuration(null);
    setTotalExpandedDuration(null);
  }, []);

  const updateStep = (key: string, update: Partial<StepState>) => {
    setSteps((prev) => ({ ...prev, [key]: { ...prev[key], ...update } }));
  };

  const runStep = async (key: string, fn: () => Promise<string>) => {
    updateStep(key, { status: "running" });
    const t0 = performance.now();
    const detail = await fn();
    updateStep(key, { status: "done", detail, durationMs: performance.now() - t0 });
  };

  const runExpanded = useCallback(async () => {
    reset();
    setRunning(true);
    const id = Number(userId);
    const t0 = performance.now();
    try {
      await runStep("validate", () => validateInput(id));
      await runStep("auth", () => buildAuthHeaders());
      await runStep("serialize", () => serializeRequest(id));
      let raw: User | undefined;
      await runStep("fetch", async () => { raw = await executeFetch(id); return `Found: ${raw.name}`; });
      const fetched = raw as User;
      await runStep("parse", () => parseResponse(fetched));
      let formatted: User | undefined;
      await runStep("format", async () => { formatted = await formatResult(fetched); return "Dates & fields formatted"; });
      setTotalExpandedDuration(performance.now() - t0);
      setResult(formatted as User);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setSteps((prev) => {
        const updated = { ...prev };
        for (const key of STEP_KEYS) {
          if (updated[key].status === "running") updated[key] = { ...updated[key], status: "error", detail: msg };
        }
        return updated;
      });
    } finally { setRunning(false); }
  }, [userId, reset]);

  const runFacade = useCallback(async () => {
    reset();
    setRunning(true);
    const id = Number(userId);
    try {
      const t0 = performance.now();
      const user = await fetchUser(id);
      setFacadeDuration(performance.now() - t0);
      setResult(user);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setRunning(false); }
  }, [userId, reset]);

  const doneCount = STEP_KEYS.filter((k) => steps[k].status === "done").length;

  return {
    mode, setMode, userId, setUserId, steps, result, error, running,
    facadeDuration, totalExpandedDuration, doneCount,
    reset, handleFetch: mode === "expanded" ? runExpanded : runFacade,
  };
}
