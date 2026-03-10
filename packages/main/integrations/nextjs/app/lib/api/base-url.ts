/**
 * Resolve the base URL for internal API calls.
 *
 * Server Components / Server Actions need an absolute URL because
 * there's no browser origin to resolve against.
 */
export function baseUrl(path = '') {
  // Server-side needs an absolute URL (no browser origin to resolve against).
  // NEXT_PUBLIC_API_URL can be set for deployed environments; the localhost
  // fallback is intentional — this is a local-only demo app.
  const base = typeof window === 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 3000}/api/books`)
    : '/api/books'
  return `${base}${path}`
}
