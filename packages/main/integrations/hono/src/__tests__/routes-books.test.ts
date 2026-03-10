import { describe, expect, beforeEach, it } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import app from '../app.js'
import * as store from '../lib/store.js'
import type { StoredBook } from '../lib/schemas.js'
import { genreArb, isbnArb, bookPayloadArb } from './arbitraries.js'

const invalidPayloadArb = fc.oneof(
  fc.record({ author: fc.string(), isbn: isbnArb, genre: genreArb }).map(
    (r) => r as Record<string, unknown>,
  ),
  fc.record({ title: fc.string(), isbn: isbnArb, genre: genreArb }).map(
    (r) => r as Record<string, unknown>,
  ),
  fc.record({ title: fc.string(), author: fc.string(), genre: genreArb }).map(
    (r) => r as Record<string, unknown>,
  ),
  fc.record({ title: fc.string(), author: fc.string(), isbn: isbnArb }).map(
    (r) => r as Record<string, unknown>,
  ),
  fc.record({
    title: fc.string({ minLength: 1 }),
    author: fc.string({ minLength: 1 }),
    isbn: fc.string().filter((s) => !/^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/.test(s)),
    genre: genreArb,
  }).map((r) => r as Record<string, unknown>),
  fc.record({
    title: fc.oneof(fc.integer(), fc.boolean(), fc.constant(null)),
    author: fc.string(),
    isbn: isbnArb,
    genre: genreArb,
  }).map((r) => r as Record<string, unknown>),
  fc.constant({} as Record<string, unknown>),
)

function postBook(body: unknown) {
  return app.request('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function deleteBook(id?: string) {
  const url = id ? `/books?id=${id}` : '/books'
  return app.request(url, { method: 'DELETE' })
}

const samplePayload = {
  title: 'the great gatsby',
  author: 'f. scott fitzgerald',
  isbn: '0743273567',
  genre: 'Fiction',
}

describe('books routes', () => {
  beforeEach(() => {
    store.clear()
    store.setChaos(false)
  })

  describe('GET /books', () => {
    it('returns 200 with empty array when store is empty', async () => {
      const res = await app.request('/books')
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual([])
    })

    it('returns 200 with all stored books', async () => {
      const book: StoredBook = {
        id: crypto.randomUUID(),
        title: 'Test Book',
        author: 'Test Author',
        isbn: '0743273567',
        genre: 'Fiction',
        addedAt: new Date().toISOString(),
      }
      store.add(book)

      const res = await app.request('/books')
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body).toHaveLength(1)
      expect(body[0]).toEqual(book)
    })
  })

  describe('POST /books', () => {
    it('returns 201 with stored book for valid payload', async () => {
      const res = await postBook(samplePayload)
      expect(res.status).toBe(201)

      const body = await res.json()
      expect(body.id).toBeDefined()
      expect(body.title).toBe(titleCase(samplePayload.title))
      expect(body.author).toBe(titleCase(samplePayload.author))
      expect(body.isbn).toBe(samplePayload.isbn)
      expect(body.genre).toBe(samplePayload.genre)
      expect(body.addedAt).toBeDefined()
    })
  })

  describe('DELETE /books', () => {
    it('returns 204 when deleting a specific book', async () => {
      const postRes = await postBook(samplePayload)
      const book = await postRes.json()

      const res = await deleteBook(book.id)
      expect(res.status).toBe(204)

      const getRes = await app.request('/books')
      expect(await getRes.json()).toEqual([])
    })

    it('returns 204 when deleting all books with id=all', async () => {
      await postBook(samplePayload)
      await postBook({ ...samplePayload, isbn: '9780743273565' })

      const res = await deleteBook('all')
      expect(res.status).toBe(204)

      const getRes = await app.request('/books')
      expect(await getRes.json()).toEqual([])
    })

    it('returns 400 when id parameter is missing', async () => {
      const res = await deleteBook()
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error.message).toBeDefined()
    })
  })

  describe('invalid payload rejection', () => {
    itProp.prop(
      [invalidPayloadArb],
      { numRuns: 100 },
    )('POST /books returns 400 for any payload not matching bookSchema', async (payload) => {
      const res = await postBook(payload)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error.message).toBeDefined()
    })
  })

  describe('titleCase normalization', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('stored title and author equal titleCase(original)', async (payload) => {
      store.clear()

      const res = await postBook(payload)
      expect(res.status).toBe(201)

      const body = await res.json()
      expect(body.title).toBe(titleCase(payload.title))
      expect(body.author).toBe(titleCase(payload.author))
    })
  })

  describe('duplicate ISBN detection', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('POST with same ISBN returns 409', async (payload) => {
      store.clear()

      const first = await postBook(payload)
      expect(first.status).toBe(201)

      const second = await postBook(payload)
      expect(second.status).toBe(409)

      const body = await second.json()
      expect(body.error.code).toBe(0x9001)
    })
  })

  describe('delete non-existent book', () => {
    itProp.prop(
      [fc.uuid()],
      { numRuns: 100 },
    )('DELETE returns 404 for any id not in store', async (id) => {
      const res = await deleteBook(id)
      expect(res.status).toBe(404)

      const body = await res.json()
      expect(body.error.code).toBe(0x9003)
    })
  })
})
