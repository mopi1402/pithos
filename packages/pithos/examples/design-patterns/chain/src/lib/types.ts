export interface Request {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: unknown;
  user?: { id: string };
}

export interface Response {
  status: number;
  statusText: string;
  body?: string;
}

export interface MiddlewareStep {
  name: string;
  icon: string;
  passed: boolean;
  message: string;
  response?: Response;
}

export interface MiddlewareConfig {
  rateLimit: boolean;
  auth: boolean;
  validation: boolean;
  logging: boolean;
}
