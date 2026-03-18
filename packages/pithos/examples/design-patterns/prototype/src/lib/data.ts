import type { AppConfig, FieldDef } from "./types";

export const BASE_CONFIG: AppConfig = {
  server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "/etc/ssl/cert.pem" } },
  database: { host: "localhost", pool: { min: 5, max: 20 } },
  logging: { level: "info", format: "json" },
};

export const FIELDS: FieldDef[] = [
  { path: "server.port", label: "Server Port", type: "number" },
  { path: "server.ssl.enabled", label: "SSL Enabled", type: "boolean" },
  { path: "database.pool.max", label: "DB Pool Max", type: "number" },
  { path: "logging.level", label: "Log Level", type: "string", options: ["debug", "info", "warn", "error"] },
];
