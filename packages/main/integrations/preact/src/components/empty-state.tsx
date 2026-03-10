export function EmptyState({ onSeed, seeding }: { onSeed: () => void; seeding: boolean }) {
  return (
    <div class="flex flex-col items-center justify-center py-24 text-center">
      <p class="text-4xl">📚</p>
      <h1 class="mt-4 text-xl font-semibold">Your collection is empty</h1>
      <p class="mt-2 text-sm text-zinc-500">Add your first book to get started.</p>
      <a
        href="/add"
        class="mt-6 rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
      >
        Add a book
      </a>
      <button
        onClick={onSeed}
        disabled={seeding}
        class="mt-3 rounded border border-zinc-200 px-4 py-1.5 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-50"
      >
        {seeding ? 'Seeding...' : 'Load sample books'}
      </button>
    </div>
  )
}
