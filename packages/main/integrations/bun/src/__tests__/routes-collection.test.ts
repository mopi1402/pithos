import { describe, expect, beforeEach, test } from 'bun:test'
import fc from 'fast-check'
import { handleGetCollection } from '../routes/collection.ts'
import * as store from '../lib/store.ts'
import type { StoredBook } from '../lib/schemas.ts'
import { uniqueStoredBooksArb } from './arbitraries.ts'

/** Type-safe json helper — avoids `as` casts scattered across tests. */
function json<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>
}

describe('collection routes', () => {
  beforeEach(() => {
    store.clear()
    store.setChaos(false)
  })

  test('returns 200 with empty array when collection is empty', async () => {
    const res = handleGetCollection(new Request('http://localhost/books/collection'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  // Feature: bun-integration-demo, Property 8: Grouping and sorting
  test('groups by genre, union equals store, each group sorted by addedAt desc', async () => {
    await fc.assert(
      fc.asyncProperty(uniqueStoredBooksArb, async (books) => {
        store.clear()
        for (const book of books) store.add(book)

        const res = handleGetCollection(new Request('http://localhost/books/collection'))
        expect(res.status).toBe(200)

        const groups = await json<Array<{ genre: string; books: StoredBook[] }>>(res)

        for (const group of groups) {
          for (const book of group.books) {
            expect(book.genre).toBe(group.genre)
          }
        }

        const allBooksFromGroups = groups.flatMap((g) => g.books)
        expect(allBooksFromGroups).toHaveLength(books.length)
        expect(new Set(allBooksFromGroups.map((b) => b.id))).toEqual(new Set(books.map((b) => b.id)))

        for (const group of groups) {
          const groupBooks = group.books
          for (let i = 1; i < groupBooks.length; i++) {
            const prev = groupBooks[i - 1]!
            const curr = groupBooks[i]!
            expect(prev.addedAt >= curr.addedAt).toBe(true)
          }
        }
      }),
      { numRuns: 100 },
    )
  })
})
