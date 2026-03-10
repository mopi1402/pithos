export function ConnectionError({ backendUrl }: { backendUrl: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <p className="text-3xl">🔌</p>
      <h2 className="mt-3 text-lg font-semibold text-red-800">Backend unreachable</h2>
      <p className="mt-2 text-sm text-red-700">
        Unable to connect to the Hono, Express or Bun server at{' '}
        <a
          href={backendUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono underline hover:text-red-900"
        >
          {backendUrl}
        </a>
      </p>
      <p className="mt-3 text-xs text-red-600">
        Start it with{' '}
        <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono">
          cd packages/main/integrations/hono && pnpm dev
        </code>
        <br />
        or{' '}
        <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono">
          cd packages/main/integrations/express && pnpm dev
        </code>
        <br />
        or{' '}
        <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono">
          cd packages/main/integrations/bun && bun dev
        </code>
      </p>
    </div>
  )
}
