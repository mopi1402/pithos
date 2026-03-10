import type { StoredBook } from '../lib/schemas'

export function BookCard({ book, onRemove }: { book: StoredBook; onRemove: (id: string) => void }) {
  return (
    <li className="flex items-center text-sm">
      <span>
        <strong>{book.title}</strong> · {book.author}
        <span className="ml-2 text-zinc-400">ISBN {book.isbn}</span>
      </span>
      <button
        onClick={() => onRemove(book.id)}
        className="ml-auto text-zinc-300 hover:text-red-500"
        aria-label={`Remove ${book.title}`}
      >
        ×
      </button>
    </li>
  )
}
