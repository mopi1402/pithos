import { NextResponse } from 'next/server'
import { CodedError } from '@pithos/core/sphalma/error-factory'
import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { bookSchema } from '../../lib/schemas/book'
import type { StoredBook } from '../../lib/types'
import {
  createBookError,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../../lib/errors/book-errors'
import * as store from './store'

/**
 * Chaos mode: randomly throws a STORAGE_FAILURE CodedError
 * to simulate an unreliable backend (network issues, DB down, etc.).
 */
function maybeFail() {
  if (store.isChaosEnabled()) {
    throw createBookError(
      STORAGE_FAILURE,
      'Simulated storage failure. The backend is having a bad day.',
    )
  }
}

/** Serialize a CodedError into a JSON response. */
function errorResponse(error: CodedError, status: number) {
  // error.details is intentionally included for demo/debugging purposes.
  // In a production app, omit `details` to avoid leaking internals.
  return NextResponse.json(
    { error: { code: error.code, key: error.key, message: String(error.details) } },
    { status },
  )
}

// ── GET /api/books ─────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json(store.getAll())
}

// ── POST /api/books ────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    maybeFail()
    const body: unknown = await request.json()
    const result = ensure(bookSchema, body)

    if (result.isErr()) {
      return NextResponse.json({ error: { message: result.error } }, { status: 400 })
    }

    const book = result.value

    if (store.findByIsbn(book.isbn)) {
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

    store.add(storedBook)
    return NextResponse.json(storedBook, { status: 201 })
  } catch (e) {
    if (e instanceof CodedError) {
      const status = e.code === DUPLICATE_ISBN ? 409 : 503
      return errorResponse(e, status)
    }
    throw e
  }
}

// ── DELETE /api/books?id=<uuid> ────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    maybeFail()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id === 'all') {
      store.clear()
      return new NextResponse(null, { status: 204 })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    const removed = store.remove(id)
    if (!removed) {
      throw createBookError(BOOK_NOT_FOUND, `No book found with id "${id}".`)
    }

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof CodedError) {
      const status = e.code === BOOK_NOT_FOUND ? 404 : 503
      return errorResponse(e, status)
    }
    throw e
  }
}
