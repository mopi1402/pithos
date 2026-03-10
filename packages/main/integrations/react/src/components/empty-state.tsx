import { Link } from 'react-router'

export function EmptyState({ onSeed, seeding }: { onSeed: () => void; seeding: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-4xl">📚</p>
      <h1 className="mt-4 text-xl font-semibold">Your collection is empty</h1>
      <p className="mt-2 text-sm text-zinc-500">Add your first book to get started.</p>
      <Link
        to="/add"
        className="mt-6 rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
      >
        Add a book
      </Link>
      <button
        onClick={onSeed}
        disabled={seeding}
        className="mt-3 rounded border border-zinc-200 px-4 py-1.5 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-50"
      >
        {seeding ? 'Seeding...' : 'Load sample books'}
      </button>
    </div>
  )
}
