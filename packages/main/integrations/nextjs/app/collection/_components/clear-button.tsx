'use client'

import { useServerAction } from '../../hooks/use-server-action'
import { clearCollection } from '../_actions/clear-books'

export default function ClearButton({ onError }: { onError?: (msg: string) => void }) {
  const { execute, pending } = useServerAction(clearCollection, onError)

  return (
    <button
      onClick={execute}
      disabled={pending}
      className="text-xs text-zinc-400 hover:text-red-500 disabled:opacity-50"
    >
      {pending ? 'Clearing...' : 'Clear all'}
    </button>
  )
}
