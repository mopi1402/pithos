/**
 * API Request Facade.
 *
 * 6 subsystem steps vs 1 facade function — same result, different experience.
 * fetchUser() is the facade: one call orchestrates everything.
 */

import type { User } from "./types";

const USERS: Record<number, User> = {
  1: { id: 1, name: "Alice Martin", email: "alice@example.com", role: "admin", lastLogin: "2026-03-25T14:30:00Z" },
  2: { id: 2, name: "Bob Chen", email: "bob@example.com", role: "editor", lastLogin: "2026-03-24T09:15:00Z" },
  3: { id: 3, name: "Clara Dupont", email: "clara@example.com", role: "viewer", lastLogin: "2026-03-20T18:45:00Z" },
  42: { id: 42, name: "Douglas Adams", email: "douglas@example.com", role: "admin", lastLogin: "1979-10-12T00:00:00Z" },
};

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function validateInput(userId: number): Promise<string> {
  await delay(300);
  if (!Number.isInteger(userId) || userId < 1) throw new Error(`Invalid user ID: ${userId}`);
  return `ID ${userId} is valid`;
}

export async function buildAuthHeaders(): Promise<string> {
  await delay(400);
  return `Authorization: Bearer ${btoa(`demo-token-${Date.now()}`).slice(0, 20)}…`;
}

export async function serializeRequest(userId: number): Promise<string> {
  await delay(200);
  return `POST /api/users → ${JSON.stringify({ id: userId, fields: ["name", "email", "role", "lastLogin"] }).slice(0, 40)}…`;
}

export async function executeFetch(userId: number): Promise<User> {
  await delay(500);
  const user = USERS[userId];
  if (!user) throw new Error(`User ${userId} not found`);
  return user;
}

export async function parseResponse(user: User): Promise<string> {
  await delay(250);
  if (!user.name || !user.email) throw new Error("Malformed response");
  return `Parsed: ${user.name} <${user.email}>`;
}

export async function formatResult(user: User): Promise<User> {
  await delay(150);
  return { ...user, lastLogin: new Date(user.lastLogin).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
}

/** The Facade — one call, same result */
export async function fetchUser(userId: number): Promise<User> {
  await validateInput(userId);
  await buildAuthHeaders();
  await serializeRequest(userId);
  const raw = await executeFetch(userId);
  await parseResponse(raw);
  return formatResult(raw);
}
