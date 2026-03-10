import { describe, expect, beforeEach, test } from 'bun:test'
import fc from 'fast-check'
import { handlePostSeed } from '../routes/seed.ts'
import * as store from '../lib/store.ts'
import { sampleBooks } from '../lib/fixtures.ts'
import type { StoredBook } from '../lib/schemas.ts'
import { storedBookArb } from './arbitraries.ts'

/** Type-safe json helper — avoids `as` casts scattered across tests. */
function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>
}

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

describe('seed routes', () => {
  beforeEach(() => {
    store.clear()
    store.setChaos(false)
  })

  // Feature: bun-integration-demo, Property 14: Seed replaces store regardless of initial state
  test('seed replaces store with fixtures regardless of initial state', async () => {
    await fc.assert(
      fc.asyncProperty(initialBooksArb, async (initialBooks) => {
        store.clear()
        for (const book of initialBooks) store.add(book)

        const res = handlePostSeed(new Request('http://localhost/books/seed', { method: 'POST' }))
        expect(res.status).toBe(201)

        const body = await json<StoredBook[]>(res)

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
