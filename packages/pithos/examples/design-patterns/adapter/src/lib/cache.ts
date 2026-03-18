/**
 * Cache + circuit breaker for adapted API calls.
 * Infrastructure around the adapter pattern — not the pattern itself.
 */

import { adaptedFetchCharging, adaptedFetchFuel } from "./adapters";
import { FALLBACK_CHARGING, FALLBACK_FUELS } from "@/data/sources";
import type { BBox, FetchResult, MapFeature, SourceType } from "./types";

const CACHE_TTL_OK = 5 * 60_000;
const CACHE_TTL_ERR = 30_000;

interface CacheEntry<T> { data: T; ts: number; ttl: number }

function bboxKey(bbox: BBox): string {
  const r = (n: number) => n.toFixed(3);
  return `${r(bbox.south)},${r(bbox.west)},${r(bbox.north)},${r(bbox.east)}`;
}

const cCache = new Map<string, CacheEntry<MapFeature[]>>();
const fCache = new Map<string, CacheEntry<MapFeature[]>>();

function getC<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > entry.ttl) { cache.delete(key); return null; }
  return entry.data;
}

function setC<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T, ttl: number): void {
  cache.set(key, { data, ts: Date.now(), ttl });
}

// ── Circuit breaker ─────────────────────────────────────────────────

const deadSources = new Set<SourceType>();

function isPermanentError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  if (err instanceof Response) return err.status >= 400 && err.status < 500;
  return false;
}

export function isSourceDead(source: SourceType): boolean {
  return deadSources.has(source);
}

// ── Public fetch functions ──────────────────────────────────────────

export async function fetchCharging(bbox: BBox): Promise<FetchResult> {
  if (deadSources.has("charging")) return { features: FALLBACK_CHARGING, fallback: true, cached: true };
  const key = bboxKey(bbox);
  const hit = getC(cCache, key);
  if (hit) return { features: hit, fallback: false, cached: true };
  try {
    const features = await adaptedFetchCharging(bbox);
    setC(cCache, key, features, CACHE_TTL_OK);
    return { features, fallback: false, cached: false };
  } catch (err) {
    if (isPermanentError(err)) deadSources.add("charging");
    else setC(cCache, key, FALLBACK_CHARGING, CACHE_TTL_ERR);
    return { features: FALLBACK_CHARGING, fallback: true, cached: false };
  }
}

export async function fetchFuels(bbox: BBox): Promise<FetchResult> {
  if (deadSources.has("fuel")) return { features: FALLBACK_FUELS, fallback: true, cached: true };
  const key = bboxKey(bbox);
  const hit = getC(fCache, key);
  if (hit) return { features: hit, fallback: false, cached: true };
  try {
    const features = await adaptedFetchFuel(bbox);
    setC(fCache, key, features, CACHE_TTL_OK);
    return { features, fallback: false, cached: false };
  } catch (err) {
    if (isPermanentError(err)) deadSources.add("fuel");
    else setC(fCache, key, FALLBACK_FUELS, CACHE_TTL_ERR);
    return { features: FALLBACK_FUELS, fallback: true, cached: false };
  }
}
