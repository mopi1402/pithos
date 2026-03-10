import { describe, expect, beforeEach, test } from 'bun:test'
import fc from 'fast-check'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { handleGetBooks, handlePostBook, handleDeleteBook } from '../routes/books.ts'
import { handleError } from '../lib/error-handler.ts'
import * as store from '../lib/store.ts'
import type { StoredBook } from '../lib/schemas.ts'
import { genreArb, isbnArb, bookPayloadArb } from './arbitraries.ts'

/** Type-safe json helper — avoids `as` casts scattered across tests. */
function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>
}

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

async function postBook(body: unknown): Promise<Response> {
  const req = new Request('http://localhost/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  try {
    return await handlePostBook(req)
  } catch (err) {
    return handleError(err)
  }
}

function deleteBook(id?: string): Response {
  const url = id ? `http://localhost/books?id=${id}` : 'http://localhost/books'
  const req = new Request(url, { method: 'DELETE' })
  try {
    return handleDeleteBook(req)
  } catch (err) {
    return handleError(err)
  }
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
    test('returns 200 with empty array when store is empty', async () => {
      const res = handleGetBooks(new Request('http://localhost/books'))
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual([])
    })

    test('returns 200 with all stored books', async () => {
      const book: StoredBook = {
        id: crypto.randomUUID(),
        title: 'Test Book',
        author: 'Test Author',
        isbn: '0743273567',
        genre: 'Fiction',
        addedAt: new Date().toISOString(),
      }
      store.add(book)

      const res = handleGetBooks(new Request('http://localhost/books'))
      expect(res.status).toBe(200)
      const body: StoredBook[] = await json<StoredBook[]>(res)
      expect(body).toHaveLength(1)
      expect(body[0]).toEqual(book)
    })
  })

  describe('POST /books', () => {
    test('returns 201 with stored book for valid payload', async () => {
      const res = await postBook(samplePayload)
      expect(res.status).toBe(201)

      const body: StoredBook = await json<StoredBook>(res)
      expect(body.id).toBeDefined()
      expect(body.title).toBe(titleCase(samplePayload.title))
      expect(body.author).toBe(titleCase(samplePayload.author))
      expect(body.isbn).toBe(samplePayload.isbn)
      expect(body.genre).toBe(samplePayload.genre)
      expect(body.addedAt).toBeDefined()
    })
  })

  describe('DELETE /books', () => {
    test('returns 204 when deleting a specific book', async () => {
      const postRes = await postBook(samplePayload)
      const book: StoredBook = await json<StoredBook>(postRes)

      const res = deleteBook(book.id)
      expect(res.status).toBe(204)

      const getRes = handleGetBooks(new Request('http://localhost/books'))
      expect(await getRes.json()).toEqual([])
    })

    test('returns 204 when deleting all books with id=all', async () => {
      await postBook(samplePayload)
      await postBook({ ...samplePayload, isbn: '9780743273565' })

      const res = deleteBook('all')
      expect(res.status).toBe(204)

      const getRes = handleGetBooks(new Request('http://localhost/books'))
      expect(await getRes.json()).toEqual([])
    })

    test('returns 400 when id parameter is missing', async () => {
      const res = deleteBook()
      expect(res.status).toBe(400)
      const body = await json<{ error: { message: string } }>(res)
      expect(body.error.message).toBeDefined()
    })
  })

  // Feature: bun-integration-demo, Property 5: Invalid payload rejection
  describe('invalid payload rejection', () => {
    test('POST /books returns 400 for any payload not matching bookSchema', async () => {
      await fc.assert(
        fc.asyncProperty(invalidPayloadArb, async (payload) => {
          const res = await postBook(payload)
          expect(res.status).toBe(400)
          const body = await json<{ error: { message: string } }>(res)
          expect(body.error.message).toBeDefined()
        }),
        { numRuns: 100 },
      )
    })
  })

  // Feature: bun-integration-demo, Property 7: titleCase normalization
  describe('titleCase normalization', () => {
    test('stored title and author equal titleCase(original)', async () => {
      await fc.assert(
        fc.asyncProperty(bookPayloadArb, async (payload) => {
          store.clear()

          const res = await postBook(payload)
          expect(res.status).toBe(201)

          const body: StoredBook = await json<StoredBook>(res)
          expect(body.title).toBe(titleCase(payload.title))
          expect(body.author).toBe(titleCase(payload.author))
        }),
        { numRuns: 100 },
      )
    })
  })

  // Feature: bun-integration-demo, Property 9: Duplicate ISBN detection
  describe('duplicate ISBN detection', () => {
    test('POST with same ISBN returns 409', async () => {
      await fc.assert(
        fc.asyncProperty(bookPayloadArb, async (payload) => {
          store.clear()

          const first = await postBook(payload)
          expect(first.status).toBe(201)

          const second = await postBook(payload)
          expect(second.status).toBe(409)

          const body: { error: { code: number } } = await json(second)
          expect(body.error.code).toBe(0x9001)
        }),
        { numRuns: 100 },
      )
    })
  })

  // Feature: bun-integration-demo, Property 10: Delete non-existent book
  describe('delete non-existent book', () => {
    test('DELETE returns 404 for any id not in store', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (id) => {
          const res = deleteBook(id)
          expect(res.status).toBe(404)

          const body: { error: { code: number } } = await json(res)
          expect(body.error.code).toBe(0x9003)
        }),
        { numRuns: 100 },
      )
    })
  })
})
