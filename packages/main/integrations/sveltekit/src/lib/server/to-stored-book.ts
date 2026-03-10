import { titleCase } from '@pithos/core/arkhe/string/title-case'
import type { Book } from '$lib/schemas/book'
import type { StoredBook } from '$lib/types'

/** Maps a validated Book to a StoredBook with ID and normalized fields. */
export function toStoredBook(book: Book): StoredBook {
  return {
    id: crypto.randomUUID(),
    title: titleCase(book.title),
    author: titleCase(book.author),
    isbn: book.isbn,
    genre: book.genre,
    addedAt: book.addedAt ? book.addedAt.toISOString() : new Date().toISOString(),
  }
}
