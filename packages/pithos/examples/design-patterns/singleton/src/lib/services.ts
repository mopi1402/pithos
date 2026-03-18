/**
 * Tab 1: `once` in action.
 *
 * Three services created with `once`. First call initializes (slow),
 * subsequent calls return the same instance (instant).
 */

import { once } from "@pithos/core/eidos/singleton/singleton";

// ── Types ────────────────────────────────────────────────────────────

export interface ServiceInstance {
  name: string;
  id: string;
  connectedAt: number;
}

export interface ServiceStats {
  instancesCreated: number;
  totalRequests: number;
}

// ── Simulated async init ─────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function createConnector(name: string, delayMs: number): () => Promise<ServiceInstance> {
  return async () => {
    await delay(delayMs);
    return { name, id: crypto.randomUUID().slice(0, 8), connectedAt: Date.now() };
  };
}

// ── Singletons via `once` ────────────────────────────────────────────

function createSingletons() {
  return {
    database: once(createConnector("Database", 800)),
    cache: once(createConnector("Cache", 600)),
    logger: once(createConnector("Logger", 400)),
  };
}

let singletons = createSingletons();

export type ServiceKey = "database" | "cache" | "logger";

export function getServiceMap(): Record<ServiceKey, { getter: () => Promise<ServiceInstance>; icon: string }> {
  return {
    database: { getter: singletons.database, icon: "🗄️" },
    cache: { getter: singletons.cache, icon: "⚡" },
    logger: { getter: singletons.logger, icon: "📋" },
  };
}

export const SERVICE_KEYS: ServiceKey[] = ["database", "cache", "logger"];

// ── Reset (for demo purposes) ────────────────────────────────────────

let _instanceCount = 0;
let _requestCount = 0;

export function trackInit(): void { _instanceCount++; }
export function trackRequest(): void { _requestCount++; }
export function getStats(): ServiceStats {
  return { instancesCreated: _instanceCount, totalRequests: _requestCount };
}
export function resetAll(): void {
  _instanceCount = 0;
  _requestCount = 0;
  singletons = createSingletons();
}
