import { ensurePromise } from '@pithos/core/bridges/ensurePromise'
import { storedBooksSchema, storedBookSchema } from '../schemas/book'
import { extractError } from '../errors/extract-error'
import type { StoredBook, Book } from '../types'
import { baseUrl } from './base-url'

/** Fetch all books, validated through Kanon. */
export async function fetchBooks(): Promise<StoredBook[]> {
  const res = await fetch(baseUrl())

  if (!res.ok) {
    const msg = await extractError(res)
    throw new Error(msg)
  }

  const result = await ensurePromise(storedBooksSchema, res.json())
  return result.match(
    (books) => books,
    (err) => { throw new Error(err) },
  )
}

/** Add a book, validated through Kanon. */
export async function postBook(book: Book): Promise<StoredBook> {
  const res = await fetch(baseUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })

  if (!res.ok) {
    const msg = await extractError(res)
    throw new Error(msg)
  }

  const result = await ensurePromise(storedBookSchema, res.json())
  return result.match(
    (saved) => saved,
    (err) => { throw new Error(err) },
  )
}

/** Remove a book by id. */
export async function deleteBook(id: string): Promise<void> {
  const res = await fetch(baseUrl(`?id=${id}`), { method: 'DELETE' })

  if (!res.ok) {
    const msg = await extractError(res)
    throw new Error(msg)
  }
}

/** Clear all books. */
export async function deleteAllBooks(): Promise<void> {
  const res = await fetch(baseUrl('?id=all'), { method: 'DELETE' })

  if (!res.ok) {
    const msg = await extractError(res)
    throw new Error(msg)
  }
}
