'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { StoredBook } from '../../lib/types'
import AlertBanner from '../../_components/alert-banner'
import BookList from './book-list'
import ClearButton from './clear-button'
import SeedButton from './seed-button'

export default function CollectionView({ books }: { books: StoredBook[] }) {
  const [error, setError] = useState<string | null>(null)
  const onError = useCallback((msg: string) => setError(msg), [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          My collection
          <span className="ml-2 text-sm font-normal text-zinc-400">
            {books.length} {books.length === 1 ? 'book' : 'books'}
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <SeedButton onError={onError} />
          <ClearButton onError={onError} />
          <Link
            href="/add"
            className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            Add a book
          </Link>
        </div>
      </div>
      {error && <AlertBanner>{error}</AlertBanner>}
      <BookList books={books} onError={onError} />
    </div>
  )
}
