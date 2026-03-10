import { Router } from 'express'
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

const router = Router()

router.get('/', (_req, res) => {
  res.json(store.getAll())
})

router.post('/', (req, res) => {
  maybeFail()
  const body: unknown = req.body
  const result = ensure(bookSchema, body)
  if (result.isErr()) {
    res.status(400).json({ error: { message: result.error } })
    return
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
  res.status(201).json(storedBook)
})

router.delete('/', (req, res) => {
  maybeFail()
  const rawId = req.query['id']
  const id = typeof rawId === 'string' ? rawId : undefined
  if (id === 'all') { store.clear(); res.status(204).end(); return }
  if (!id) { res.status(400).json({ error: { message: 'Missing id parameter' } }); return }
  const removed = store.remove(id)
  if (!removed) { throw createBookError(BOOK_NOT_FOUND, `Book with id "${id}" not found.`) }
  res.status(204).end()
})

export default router
