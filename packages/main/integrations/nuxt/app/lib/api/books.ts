import { ensurePromise } from '@pithos/core/bridges/ensurePromise'
import { storedBooksSchema, storedBookSchema } from '../schemas/book'
import { USER_MESSAGES } from '../errors/extract-error'
import type { StoredBook, Book } from '../types'

const GENERIC_MESSAGE = 'Something went wrong. Please try again.'

/**
 * Extract a user-friendly message from a `$fetch` error.
 *
 * `$fetch` (ofetch) throws a `FetchError` on non-2xx responses.
 * The error's `data` property contains the already-parsed JSON body,
 * so we don't need to call `res.json()` like the Next.js version does.
 */
function extractFetchError(err: unknown): string {
  if (typeof err !== 'object' || err === null || !('data' in err)) {
    return err instanceof Error ? err.message : GENERIC_MESSAGE
  }

  const data = (err as { data: unknown }).data
  if (typeof data !== 'object' || data === null) return GENERIC_MESSAGE

  const error = (data as Record<string, unknown>).error
  if (typeof error !== 'object' || error === null) return GENERIC_MESSAGE

  const code = (error as Record<string, unknown>).code
  if (typeof code === 'number' && code in USER_MESSAGES) {
    return USER_MESSAGES[code]!
  }

  const message = (error as Record<string, unknown>).message
  if (typeof message === 'string') return message

  return GENERIC_MESSAGE
}

/** Fetch all books, validated through Kanon. */
export async function fetchBooks(): Promise<StoredBook[]> {
  try {
    const data = await $fetch('/api/books')
    const result = await ensurePromise(storedBooksSchema, Promise.resolve(data))
    return result.match(
      (books) => books,
      (err) => { throw new Error(err) },
    )
  } catch (err) {
    throw new Error(extractFetchError(err))
  }
}

/** Add a book, validated through Kanon. */
export async function postBook(book: Book): Promise<StoredBook> {
  try {
    const data = await $fetch('/api/books', {
      method: 'POST',
      body: book,
    })
    const result = await ensurePromise(storedBookSchema, Promise.resolve(data))
    return result.match(
      (saved) => saved,
      (err) => { throw new Error(err) },
    )
  } catch (err) {
    throw new Error(extractFetchError(err))
  }
}

/** Remove a book by id. */
export async function deleteBook(id: string): Promise<void> {
  try {
    await $fetch('/api/books', {
      method: 'DELETE',
      query: { id },
    })
  } catch (err) {
    throw new Error(extractFetchError(err))
  }
}

/** Clear all books. */
export async function deleteAllBooks(): Promise<void> {
  try {
    await $fetch('/api/books', {
      method: 'DELETE',
      query: { id: 'all' },
    })
  } catch (err) {
    throw new Error(extractFetchError(err))
  }
}
