'use client'

import { useServerAction } from '../../hooks/use-server-action'
import { removeBook } from '../_actions/remove-book'

export default function RemoveButton({ bookId, onError }: { bookId: string; onError?: (msg: string) => void }) {
  const { execute, pending } = useServerAction(removeBook, onError)

  return (
    <button
      onClick={() => execute(bookId)}
      disabled={pending}
      className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      aria-label="Remove book"
    >
      {pending ? (
        <svg width="10" height="10" viewBox="0 0 10 10" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="5" cy="5" r="4" strokeDasharray="12" strokeDashoffset="8" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 1l8 8M9 1l-8 8" />
        </svg>
      )}
    </button>
  )
}
