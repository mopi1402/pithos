import { useState, useCallback } from "react";
import { executeMiddlewareChainAnimated } from "@/lib/chain";
import { REQUEST_PRESETS } from "@/data/middleware";
import type { Request, Response, MiddlewareStep, MiddlewareConfig } from "@/lib/types";

export function useMiddlewareSimulator() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [config, setConfig] = useState<MiddlewareConfig>({ auth: true, rateLimit: true, validation: true, logging: true });
  const [steps, setSteps] = useState<MiddlewareStep[]>([]);
  const [finalResponse, setFinalResponse] = useState<Response | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleReset = useCallback(() => {
    setSteps([]);
    setFinalResponse(null);
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setSteps([]);
    setFinalResponse(null);
    const request = REQUEST_PRESETS[selectedPreset].request as Request;
    const response = await executeMiddlewareChainAnimated(request, config, (step) => {
      setSteps((prev) => [...prev, step]);
    });
    setFinalResponse(response);
    setIsRunning(false);
  }, [selectedPreset, config]);

  const toggleMiddleware = useCallback((key: keyof MiddlewareConfig) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
    setSteps([]);
    setFinalResponse(null);
  }, []);

  const selectPreset = useCallback((i: number) => {
    setSelectedPreset(i);
    setSteps([]);
    setFinalResponse(null);
  }, []);

  return {
    selectedPreset, config, steps, finalResponse, isRunning,
    handleRun, handleReset, toggleMiddleware, selectPreset,
    currentRequest: REQUEST_PRESETS[selectedPreset],
  };
}
