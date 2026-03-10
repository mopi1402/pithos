import { useState } from 'preact/hooks'
import { BookList } from '../components/book-list'
import { EmptyState } from '../components/empty-state'
import { AlertBanner } from '../components/alert-banner'
import { ConnectionError } from '../components/connection-error'
import { useBooks } from '../hooks/use-books'
import { CONNECTION_ERROR_PREFIX } from '../lib/api'

export function CollectionPage() {
  const { books, loading, error, removeBook, clearAll, seed } = useBooks()
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleSeed = async () => {
    setSeeding(true)
    await seed()
    setSeeding(false)
  }

  const handleClear = async () => {
    setClearing(true)
    await clearAll()
    setClearing(false)
  }

  if (loading) {
    return <p class="py-12 text-center text-zinc-400">Loading...</p>
  }

  if (error) {
    if (error.startsWith(CONNECTION_ERROR_PREFIX)) {
      return <ConnectionError backendUrl={error.slice(CONNECTION_ERROR_PREFIX.length)} />
    }
    return <AlertBanner>{error}</AlertBanner>
  }

  if (books.length === 0) {
    return <EmptyState onSeed={handleSeed} seeding={seeding} />
  }

  return (
    <div>
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-xl font-semibold">
          My collection
          <span class="ml-2 text-sm font-normal text-zinc-400">
            {books.length} {books.length === 1 ? 'book' : 'books'}
          </span>
        </h1>
        <div class="flex items-center gap-4">
          <button
            onClick={handleSeed}
            disabled={seeding}
            class="rounded border border-zinc-200 px-4 py-1.5 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Load sample books'}
          </button>
          <button
            onClick={handleClear}
            disabled={clearing}
            class="text-xs text-zinc-400 hover:text-red-500 disabled:opacity-50"
          >
            {clearing ? 'Clearing...' : 'Clear all'}
          </button>
          <a
            href="/add"
            class="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Add a book
          </a>
        </div>
      </div>
      <BookList books={books} onRemove={removeBook} />
    </div>
  )
}
