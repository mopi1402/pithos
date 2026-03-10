'use client'

import { useServerAction } from '../../hooks/use-server-action'
import { seedCollection } from '../_actions/seed-books'

export default function SeedButton({ onError }: { onError?: (msg: string) => void }) {
  const { execute, pending } = useServerAction(seedCollection, onError)

  return (
    <button
      onClick={execute}
      disabled={pending}
      className="rounded border border-zinc-200 px-4 py-1.5 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-50"
    >
      {pending ? 'Seeding...' : 'Load sample books'}
    </button>
  )
}
