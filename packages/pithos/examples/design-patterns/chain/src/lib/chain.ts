/**
 * HTTP Middleware using Chain of Responsibility pattern.
 *
 * createChain() works like Express/Hono/Koa middleware:
 * each handler can either short-circuit (return a response) or pass to next.
 */
import { createChain, type Handler } from "@pithos/core/eidos/chain/chain";
import type { Request, Response, MiddlewareStep, MiddlewareConfig } from "./types";

interface MiddlewareDef {
  key: keyof MiddlewareConfig;
  name: string;
  icon: string;
  check: (req: Request) => { pass: true; req: Request; message: string } | { pass: false; response: Response; message: string };
}

const MIDDLEWARE_DEFS: MiddlewareDef[] = [
  {
    key: "rateLimit", name: "Rate Limit", icon: "⏱️",
    check: (req) => {
      const token = req.headers.authorization || "";
      if (token.includes("rate-limited")) return { pass: false, response: { status: 429, statusText: "Too Many Requests", body: "Rate limit exceeded" }, message: "User exceeded rate limit" };
      return { pass: true, req, message: "Within rate limit (42/100 requests)" };
    },
  },
  {
    key: "auth", name: "Auth", icon: "🔐",
    check: (req) => {
      const token = req.headers.authorization;
      if (!token) return { pass: false, response: { status: 401, statusText: "Unauthorized", body: "Missing authorization token" }, message: "No token provided" };
      return { pass: true, req: { ...req, user: { id: token.replace("Bearer ", "") } }, message: `Token verified: ${token.slice(0, 20)}...` };
    },
  },
  {
    key: "validation", name: "Validation", icon: "✅",
    check: (req) => {
      const body = req.body as Record<string, unknown> | undefined;
      const isValid = body && typeof body.name === "string" && typeof body.email === "string";
      if (!isValid) return { pass: false, response: { status: 400, statusText: "Bad Request", body: "Missing required fields: email" }, message: "Body validation failed" };
      return { pass: true, req, message: "Body schema valid" };
    },
  },
  {
    key: "logging", name: "Logger", icon: "📝",
    check: (req) => ({ pass: true, req, message: `${req.method} ${req.path}` }),
  },
];

function toHandler(def: MiddlewareDef): Handler<Request, Response> {
  return (req, next) => {
    const result = def.check(req);
    return result.pass ? next(result.req) : result.response;
  };
}

export function buildPipeline(config: MiddlewareConfig): (req: Request) => Response {
  const handlers = MIDDLEWARE_DEFS.filter((def) => config[def.key]).map(toHandler);
  handlers.push(() => ({ status: 200, statusText: "OK", body: "User created successfully" }));
  return createChain(...handlers);
}

export async function executeMiddlewareChainAnimated(
  request: Request,
  config: MiddlewareConfig,
  onStep: (step: MiddlewareStep) => void,
): Promise<Response> {
  let req = { ...request };
  for (const def of MIDDLEWARE_DEFS) {
    if (!config[def.key]) continue;
    await new Promise<void>((r) => setTimeout(r, 400));
    const result = def.check(req);
    if (!result.pass) {
      onStep({ name: def.name, icon: def.icon, passed: false, message: result.message, response: result.response });
      return result.response;
    }
    req = result.req;
    onStep({ name: def.name, icon: def.icon, passed: true, message: result.message });
  }
  await new Promise<void>((r) => setTimeout(r, 400));
  const response = { status: 200, statusText: "OK", body: "User created successfully" };
  onStep({ name: "Handler", icon: "🎯", passed: true, message: "Business logic executed", response });
  return response;
}
