'use client'

import { useGroupedBooks } from '../../hooks/use-grouped-books'
import type { StoredBook } from '../../lib/types'
import RemoveButton from './remove-button'

export default function BookList({ books, onError }: { books: StoredBook[]; onError?: (msg: string) => void }) {
  const groups = useGroupedBooks(books)

  return (
    <>
      {groups.map(({ genre, books: sorted }) => (
        <section key={genre} className="mb-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-400">
            {genre}
          </h2>
          <ul className="space-y-1">
            {sorted.map((book) => (
              <li key={book.id} className="flex items-center text-sm">
                <span>
                  <strong>{book.title}</strong> · {book.author}
                  <span className="ml-2 text-zinc-400">ISBN {book.isbn}</span>
                </span>
                <RemoveButton bookId={book.id} onError={onError} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
