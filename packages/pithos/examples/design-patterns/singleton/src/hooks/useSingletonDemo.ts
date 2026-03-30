import { useState, useCallback } from "react";
import {
  getServiceMap,
  trackInit,
  trackRequest,
  getStats,
  resetAll,
  type ServiceKey,
  type ServiceInstance,
  type ServiceStats,
} from "@/lib/services";

export interface ServiceState {
  status: "idle" | "connecting" | "connected";
  instance: ServiceInstance | null;
  requestCount: number;
}

const INITIAL_SERVICES: Record<ServiceKey, ServiceState> = {
  database: { status: "idle", instance: null, requestCount: 0 },
  cache: { status: "idle", instance: null, requestCount: 0 },
  logger: { status: "idle", instance: null, requestCount: 0 },
};

export function useSingletonDemo() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [stats, setStats] = useState<ServiceStats>(getStats);

  const handleRequest = useCallback(async (key: ServiceKey) => {
    let isFirstCall = false;
    setServices((prev) => {
      isFirstCall = prev[key].status === "idle";
      if (isFirstCall) return { ...prev, [key]: { ...prev[key], status: "connecting" } };
      return prev;
    });

    trackRequest();
    const serviceMap = getServiceMap();
    const instance = await serviceMap[key].getter();
    if (isFirstCall) trackInit();

    setServices((prev) => ({
      ...prev,
      [key]: { status: "connected", instance, requestCount: prev[key].requestCount + 1 },
    }));
    setStats(getStats());
  }, []);

  const handleReset = useCallback(() => {
    resetAll();
    setServices(INITIAL_SERVICES);
    setStats(getStats());
  }, []);

  return { services, stats, handleRequest, handleReset };
}
