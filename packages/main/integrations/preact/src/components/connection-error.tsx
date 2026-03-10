export function ConnectionError({ backendUrl }: { backendUrl: string }) {
  return (
    <div class="rounded-lg border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <p class="text-3xl">🔌</p>
      <h2 class="mt-3 text-lg font-semibold text-red-800">Backend unreachable</h2>
      <p class="mt-2 text-sm text-red-700">
        Unable to connect to the Hono or Express server at{' '}
        <a
          href={backendUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono underline hover:text-red-900"
        >
          {backendUrl}
        </a>
      </p>
      <p class="mt-3 text-xs text-red-600">
        Start it with{' '}
        <code class="rounded bg-red-100 px-1.5 py-0.5 font-mono">
          cd packages/main/integrations/hono && pnpm dev
        </code>
        <br />
        or{' '}
        <code class="rounded bg-red-100 px-1.5 py-0.5 font-mono">
          cd packages/main/integrations/express && pnpm dev
        </code>
      </p>
    </div>
  )
}
