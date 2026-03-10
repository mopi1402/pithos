import { describe, expect, beforeEach, it } from 'vitest'
import fc from 'fast-check'
import request from 'supertest'
import app from '../app.js'
import * as store from '../lib/store.js'
import type { StoredBook } from '../lib/schemas.js'
import { uniqueStoredBooksArb } from './arbitraries.js'

describe('collection routes', () => {
  beforeEach(() => {
    store.clear()
    store.setChaos(false)
  })

  it('returns 200 with empty array when collection is empty', async () => {
    const res = await request(app).get('/books/collection')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  // Feature: express-integration-demo, Property 6: Grouping and sorting
  // **Validates: Requirement 6.2**
  it('groups by genre, union equals store, each group sorted by addedAt desc', async () => {
    await fc.assert(
      fc.asyncProperty(uniqueStoredBooksArb, async (books) => {
        store.clear()
        for (const book of books) store.add(book)

        const res = await request(app).get('/books/collection')
        expect(res.status).toBe(200)

        const groups: Array<{ genre: string; books: StoredBook[] }> = res.body

        for (const group of groups) {
          for (const book of group.books) {
            expect(book.genre).toBe(group.genre)
          }
        }

        const allBooksFromGroups = groups.flatMap((g) => g.books)
        expect(allBooksFromGroups).toHaveLength(books.length)
        expect(new Set(allBooksFromGroups.map((b) => b.id))).toEqual(new Set(books.map((b) => b.id)))

        for (const group of groups) {
          for (let i = 1; i < group.books.length; i++) {
            expect(group.books[i - 1].addedAt >= group.books[i].addedAt).toBe(true)
          }
        }
      }),
      { numRuns: 100 },
    )
  })
})
