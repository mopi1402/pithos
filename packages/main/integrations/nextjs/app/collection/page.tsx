import Link from 'next/link'
import { fetchBooks } from '../lib/api/books'
import CollectionView from './_components/collection-view'
import SeedButton from './_components/seed-button'

export default async function CollectionPage() {
  const books = await fetchBooks()

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl">📚</p>
        <h1 className="mt-4 text-xl font-semibold">Your collection is empty</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Add your first book to get started.
        </p>
        <Link
          href="/add"
          className="mt-6 rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
        >
          Add a book
        </Link>
        <div className="mt-3">
          <SeedButton />
        </div>
      </div>
    )
  }

  return <CollectionView books={books} />
}
