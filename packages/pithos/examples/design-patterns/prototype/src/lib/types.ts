export interface AppConfig {
  server: { host: string; port: number; ssl: { enabled: boolean; cert: string } };
  database: { host: string; pool: { min: number; max: number } };
  logging: { level: string; format: string };
}

export type ConfigPath =
  | "server.port"
  | "server.ssl.enabled"
  | "database.pool.max"
  | "logging.level";

export interface FieldDef {
  path: ConfigPath;
  label: string;
  type: "number" | "boolean" | "string";
  options?: string[];
}

export type CloneMode = "shallow" | "deep";

export interface RefCheck {
  label: string;
  shared: boolean;
}
