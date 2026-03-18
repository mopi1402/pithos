/**
 * Prototype pattern: deep clone vs shallow copy.
 *
 * deepClone from Arkhe creates a true deep copy.
 * Spread only copies the top level — nested objects are shared references.
 */

import { deepClone } from "@pithos/core/eidos/prototype/prototype";
import type { AppConfig, ConfigPath, CloneMode, RefCheck } from "./types";

export function cloneConfig(config: AppConfig, mode: CloneMode): AppConfig {
  if (mode === "deep") return deepClone(config);
  return { ...config };
}

export function getField(config: AppConfig, path: ConfigPath): string | number | boolean {
  switch (path) {
    case "server.port": return config.server.port;
    case "server.ssl.enabled": return config.server.ssl.enabled;
    case "database.pool.max": return config.database.pool.max;
    case "logging.level": return config.logging.level;
  }
}

export function setField(config: AppConfig, path: ConfigPath, value: string | number | boolean): void {
  switch (path) {
    case "server.port": config.server.port = value as number; break;
    case "server.ssl.enabled": config.server.ssl.enabled = value as boolean; break;
    case "database.pool.max": config.database.pool.max = value as number; break;
    case "logging.level": config.logging.level = value as string; break;
  }
}

export function checkReferences(original: AppConfig, clone: AppConfig): RefCheck[] {
  return [
    { label: "server", shared: original.server === clone.server },
    { label: "server.ssl", shared: original.server.ssl === clone.server.ssl },
    { label: "database", shared: original.database === clone.database },
    { label: "database.pool", shared: original.database.pool === clone.database.pool },
    { label: "logging", shared: original.logging === clone.logging },
  ];
}
