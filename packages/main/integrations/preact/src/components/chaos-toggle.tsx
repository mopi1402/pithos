import { useChaos } from '../hooks/use-chaos'

export function ChaosToggle() {
  const { enabled, loading, toggle } = useChaos()

  if (loading) return null

  return (
    <button
      onClick={toggle}
      class="flex items-center gap-2 rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700"
      aria-pressed={enabled}
    >
      <span
        class={`inline-block h-2 w-2 rounded-full ${enabled ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'}`}
      />
      {enabled ? 'Chaos mode ON' : 'Chaos mode'}
    </button>
  )
}
