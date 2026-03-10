import { useGroupedBooks } from '../hooks/use-grouped-books'
import { BookCard } from './book-card'
import type { StoredBook } from '../lib/schemas'

export function BookList({ books, onRemove }: { books: StoredBook[]; onRemove: (id: string) => void }) {
  const groups = useGroupedBooks(books)

  return (
    <>
      {groups.map(({ genre, books: sorted }) => (
        <section key={genre} class="mb-6">
          <h2 class="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-400">
            {genre}
          </h2>
          <ul class="space-y-1">
            {sorted.map((book) => (
              <BookCard key={book.id} book={book} onRemove={onRemove} />
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
