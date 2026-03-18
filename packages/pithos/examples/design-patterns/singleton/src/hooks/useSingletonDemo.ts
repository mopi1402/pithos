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
    const svc = services[key];
    const isFirstCall = svc.status === "idle";

    if (isFirstCall) {
      setServices((prev) => ({ ...prev, [key]: { ...prev[key], status: "connecting" } }));
    }

    trackRequest();
    const serviceMap = getServiceMap();
    const instance = await serviceMap[key].getter();
    if (isFirstCall) trackInit();

    setServices((prev) => ({
      ...prev,
      [key]: { status: "connected", instance, requestCount: prev[key].requestCount + 1 },
    }));
    setStats(getStats());
  }, [services]);

  const handleReset = useCallback(() => {
    resetAll();
    setServices(INITIAL_SERVICES);
    setStats(getStats());
  }, []);

  return { services, stats, handleRequest, handleReset };
}
