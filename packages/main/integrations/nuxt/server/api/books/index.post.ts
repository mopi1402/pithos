import { CodedError } from '@pithos/core/sphalma/error-factory'
import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { bookSchema } from '../../../app/lib/schemas/book'
import type { StoredBook } from '../../../app/lib/types'
import {
  createBookError,
  DUPLICATE_ISBN,
  STORAGE_FAILURE,
} from '../../../app/lib/errors/book-errors'
import { add, findByIsbn, isChaosEnabled } from '../../utils/store'

/**
 * Chaos mode: throws a STORAGE_FAILURE CodedError
 * to simulate an unreliable backend.
 */
function maybeFail() {
  if (isChaosEnabled()) {
    throw createBookError(
      STORAGE_FAILURE,
      'Simulated storage failure. The backend is having a bad day.',
    )
  }
}

/** Serialize a CodedError into a JSON body + HTTP status. */
function sendCodedError(event: Parameters<typeof setResponseStatus>[0], error: CodedError, status: number) {
  setResponseStatus(event, status)
  return { error: { code: error.code, key: error.key, message: String(error.details) } }
}

// ── POST /api/books ────────────────────────────────────────────────
export default defineEventHandler(async (event) => {
  try {
    maybeFail()
    const body: unknown = await readBody(event)
    const result = ensure(bookSchema, body)

    if (result.isErr()) {
      setResponseStatus(event, 400)
      return { error: { message: result.error } }
    }

    const book = result.value

    if (findByIsbn(book.isbn)) {
      throw createBookError(
        DUPLICATE_ISBN,
        'A book with this ISBN already exists in the collection.',
      )
    }

    const storedBook: StoredBook = {
      id: crypto.randomUUID(),
      title: titleCase(book.title),
      author: titleCase(book.author),
      isbn: book.isbn,
      genre: book.genre,
      addedAt: book.addedAt ? book.addedAt.toISOString() : new Date().toISOString(),
    }

    add(storedBook)
    setResponseStatus(event, 201)
    return storedBook
  } catch (e) {
    if (e instanceof CodedError) {
      const status = e.code === DUPLICATE_ISBN ? 409 : 503
      return sendCodedError(event, e, status)
    }
    throw e
  }
})
