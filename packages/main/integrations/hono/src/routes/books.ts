import { Hono } from 'hono'
import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { bookSchema } from '../lib/schemas.js'
import type { StoredBook } from '../lib/schemas.js'
import { createBookError, DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE } from '../lib/errors.js'
import * as store from '../lib/store.js'

function maybeFail() {
  if (store.isChaosEnabled()) {
    throw createBookError(STORAGE_FAILURE, 'Simulated storage failure. The backend is having a bad day.')
  }
}

const books = new Hono()

books.get('/', (c) => {
  return c.json(store.getAll(), 200)
})

books.post('/', async (c) => {
  maybeFail()

  const body: unknown = await c.req.json()
  const result = ensure(bookSchema, body)

  if (result.isErr()) {
    return c.json({ error: { message: result.error } }, 400)
  }

  const book = result.value

  const storedBook: StoredBook = {
    id: crypto.randomUUID(),
    title: titleCase(book.title),
    author: titleCase(book.author),
    isbn: book.isbn,
    genre: book.genre,
    addedAt: book.addedAt ? book.addedAt.toISOString() : new Date().toISOString(),
  }

  if (store.findByIsbn(storedBook.isbn)) {
    throw createBookError(DUPLICATE_ISBN, 'A book with this ISBN already exists.')
  }

  store.add(storedBook)
  return c.json(storedBook, 201)
})

books.delete('/', (c) => {
  maybeFail()

  const id = c.req.query('id')

  if (id === 'all') {
    store.clear()
    return c.body(null, 204)
  }

  if (!id) {
    return c.json({ error: { message: 'Missing id parameter' } }, 400)
  }

  const removed = store.remove(id)
  if (!removed) {
    throw createBookError(BOOK_NOT_FOUND, `Book with id "${id}" not found.`)
  }

  return c.body(null, 204)
})

export default books
