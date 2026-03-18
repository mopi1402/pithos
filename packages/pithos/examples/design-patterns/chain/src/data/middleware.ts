import type { MiddlewareConfig } from "@/lib/types";

export const MIDDLEWARE_OPTIONS: { key: keyof MiddlewareConfig; label: string; icon: string }[] = [
  { key: "rateLimit", label: "Rate Limit", icon: "⏱️" },
  { key: "auth", label: "Auth", icon: "🔐" },
  { key: "validation", label: "Validation", icon: "✅" },
  { key: "logging", label: "Logger", icon: "📝" },
];

export const REQUEST_PRESETS = [
  {
    name: "Valid request",
    description: "Has token, valid body",
    request: {
      method: "POST",
      path: "/api/users",
      headers: { authorization: "Bearer valid-token-123" },
      body: { name: "John", email: "john@example.com" },
    },
  },
  {
    name: "No auth token",
    description: "Missing authorization header",
    request: {
      method: "POST",
      path: "/api/users",
      headers: {},
      body: { name: "John", email: "john@example.com" },
    },
  },
  {
    name: "Invalid body",
    description: "Has token, but missing required fields",
    request: {
      method: "POST",
      path: "/api/users",
      headers: { authorization: "Bearer valid-token-123" },
      body: { name: "John" },
    },
  },
  {
    name: "Rate limited user",
    description: "Token for rate-limited user",
    request: {
      method: "POST",
      path: "/api/users",
      headers: { authorization: "Bearer rate-limited-user" },
      body: { name: "John", email: "john@example.com" },
    },
  },
];
