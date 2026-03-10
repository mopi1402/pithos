import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookSchema } from '$lib/schemas/book'
import { toStoredBook } from '$lib/server/to-stored-book'
import * as store from '$lib/server/store'

export const GET: RequestHandler = async () => {
  return json(store.getBooks())
}

export const POST: RequestHandler = async ({ request }) => {
  if (store.isChaosEnabled()) {
    error(503, { message: 'The server is temporarily unavailable. Please try again.' })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    error(400, { message: 'Invalid JSON body.' })
  }

  const result = ensure(bookSchema, body)

  if (result.isErr()) {
    error(400, { message: result.error })
  }

  const storedBook = toStoredBook(result.value)

  if (store.findByIsbn(storedBook.isbn)) {
    error(409, { message: 'A book with this ISBN already exists.' })
  }

  store.addBook(storedBook)
  return json(storedBook, { status: 201 })
}
