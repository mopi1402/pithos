import { describe, expect, beforeEach, afterAll, it } from 'vitest'
import fc from 'fast-check'
import request from 'supertest'
import http from 'node:http'
import app from '../app.js'
import * as store from '../lib/store.js'
import { sampleBooks } from '../lib/fixtures.js'
import type { StoredBook } from '../lib/schemas.js'
import { storedBookArb } from './arbitraries.js'

const initialBooksArb = fc
  .array(storedBookArb, { minLength: 0, maxLength: 5 })
  .map((books) => {
    const seen = new Set<string>()
    return books.filter((b) => {
      if (seen.has(b.isbn)) return false
      seen.add(b.isbn)
      return true
    })
  })

// Use a persistent server to avoid socket exhaustion during 100 property runs
const server = http.createServer(app)

describe('seed routes', () => {
  beforeEach(() => {
    store.clear()
    store.setChaos(false)
  })

  afterAll(() => {
    server.close()
  })

  // Feature: express-integration-demo, Property 12: Seed populates store with fixtures
  // **Validates: Requirement 9.1**
  it('seed replaces store with fixtures regardless of initial state', async () => {
    await fc.assert(
      fc.asyncProperty(initialBooksArb, async (initialBooks) => {
        store.clear()
        for (const book of initialBooks) store.add(book)

        const res = await request(server).post('/books/seed')
        expect(res.status).toBe(201)

        const body: StoredBook[] = res.body

        expect(body).toHaveLength(sampleBooks.length)
        expect(store.getAll()).toHaveLength(sampleBooks.length)

        const ids = body.map((b) => b.id)
        expect(new Set(ids).size).toBe(ids.length)

        const sortByIsbn = (a: { isbn: string }, b: { isbn: string }) =>
          a.isbn.localeCompare(b.isbn)
        const fixtureData = sampleBooks.map(({ title, author, isbn, genre }) => ({ title, author, isbn, genre }))
        const bodyData = body.map(({ title, author, isbn, genre }) => ({ title, author, isbn, genre }))
        expect(bodyData.sort(sortByIsbn)).toEqual(fixtureData.sort(sortByIsbn))
      }),
      { numRuns: 100 },
    )
  })
})
