import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { bookSchema } from '../lib/schemas.ts'
import type { StoredBook } from '../lib/schemas.ts'
import { createBookError, DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE } from '../lib/errors.ts'
import * as store from '../lib/store.ts'

function maybeFail() {
  if (store.isChaosEnabled()) {
    throw createBookError(STORAGE_FAILURE, 'Simulated storage failure. The backend is having a bad day.')
  }
}

export function handleGetBooks(_req: Request): Response {
  return Response.json(store.getAll(), { status: 200 })
}

export async function handlePostBook(req: Request): Promise<Response> {
  maybeFail()

  const body: unknown = await req.json()
  const result = ensure(bookSchema, body)

  if (result.isErr()) {
    return Response.json({ error: { message: result.error } }, { status: 400 })
  }

  const book = result.value

  if (store.findByIsbn(book.isbn)) {
    throw createBookError(DUPLICATE_ISBN, 'A book with this ISBN already exists.')
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
  return Response.json(storedBook, { status: 201 })
}

export function handleDeleteBook(req: Request): Response {
  maybeFail()

  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (id === 'all') {
    store.clear()
    return new Response(null, { status: 204 })
  }

  if (!id) {
    return Response.json({ error: { message: 'Missing id parameter' } }, { status: 400 })
  }

  const removed = store.remove(id)
  if (!removed) {
    throw createBookError(BOOK_NOT_FOUND, `Book with id "${id}" not found.`)
  }

  return new Response(null, { status: 204 })
}
