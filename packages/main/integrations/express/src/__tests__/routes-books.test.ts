import { describe, expect, beforeEach, it } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import request from 'supertest'
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
      const res = await request(app).get('/books')
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
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

      const res = await request(app).get('/books')
      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toEqual(book)
    })
  })

  describe('POST /books', () => {
    it('returns 201 with stored book for valid payload', async () => {
      const res = await request(app).post('/books').send(samplePayload)
      expect(res.status).toBe(201)

      expect(res.body.id).toBeDefined()
      expect(res.body.title).toBe(titleCase(samplePayload.title))
      expect(res.body.author).toBe(titleCase(samplePayload.author))
      expect(res.body.isbn).toBe(samplePayload.isbn)
      expect(res.body.genre).toBe(samplePayload.genre)
      expect(res.body.addedAt).toBeDefined()
    })
  })

  describe('DELETE /books', () => {
    it('returns 204 when deleting a specific book', async () => {
      const postRes = await request(app).post('/books').send(samplePayload)
      const book = postRes.body

      const res = await request(app).delete(`/books?id=${book.id}`)
      expect(res.status).toBe(204)

      const getRes = await request(app).get('/books')
      expect(getRes.body).toEqual([])
    })

    it('returns 204 when deleting all books with id=all', async () => {
      await request(app).post('/books').send(samplePayload)
      await request(app).post('/books').send({ ...samplePayload, isbn: '9780743273565' })

      const res = await request(app).delete('/books?id=all')
      expect(res.status).toBe(204)

      const getRes = await request(app).get('/books')
      expect(getRes.body).toEqual([])
    })

    it('returns 400 when id parameter is missing', async () => {
      const res = await request(app).delete('/books')
      expect(res.status).toBe(400)
      expect(res.body.error.message).toBeDefined()
    })
  })

  // Feature: express-integration-demo, Property 4: Invalid payload rejection
  // **Validates: Requirements 5.2**
  describe('invalid payload rejection', () => {
    itProp.prop(
      [invalidPayloadArb],
      { numRuns: 100 },
    )('POST /books returns 400 for any payload not matching bookSchema', async (payload) => {
      const res = await request(app).post('/books').send(payload)
      expect(res.status).toBe(400)
      expect(res.body.error.message).toBeDefined()
    })
  })

  // Feature: express-integration-demo, Property 5: titleCase normalization
  // **Validates: Requirement 6.1**
  describe('titleCase normalization', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('stored title and author equal titleCase(original)', async (payload) => {
      store.clear()

      const res = await request(app).post('/books').send(payload)
      expect(res.status).toBe(201)

      expect(res.body.title).toBe(titleCase(payload.title))
      expect(res.body.author).toBe(titleCase(payload.author))
    })
  })

  // Feature: express-integration-demo, Property 8: Duplicate ISBN detection
  // **Validates: Requirement 7.3**
  describe('duplicate ISBN detection', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('POST with same ISBN returns 409', async (payload) => {
      store.clear()

      const first = await request(app).post('/books').send(payload)
      expect(first.status).toBe(201)

      const second = await request(app).post('/books').send(payload)
      expect(second.status).toBe(409)

      expect(second.body.error.code).toBe(0x9001)
    })
  })

  // Feature: express-integration-demo, Property 9: Delete non-existent book
  // **Validates: Requirement 7.6**
  describe('delete non-existent book', () => {
    itProp.prop(
      [fc.uuid()],
      { numRuns: 100 },
    )('DELETE returns 404 for any id not in store', async (id) => {
      const res = await request(app).delete(`/books?id=${id}`)
      expect(res.status).toBe(404)

      expect(res.body.error.code).toBe(0x9003)
    })
  })
})
