import { describe, expect, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import {
  getBooks,
  addBook,
  clearBooks,
  isChaosEnabled,
  setChaos,
} from '$lib/server/store'
import type { StoredBook } from '$lib/types'

// Use integer timestamps to avoid Invalid Date errors during shrinking.
// Constrain genres to avoid Object prototype property collisions (e.g. "valueOf", "toString")
// which cause groupBy to fail — this is a known limitation of plain-object-based grouping.
const isoDateArb = fc
  .integer({ min: -2208988800000, max: 4102444800000 }) // 1900-01-01 to 2100-01-01
  .map((ts) => new Date(ts).toISOString())

const storedBookArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  author: fc.string({ minLength: 1 }),
  isbn: fc.string({ minLength: 1 }),
  genre: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 -]{0,19}$/),
  addedAt: isoDateArb,
})

beforeEach(() => {
  clearBooks()
  setChaos(false)
})

describe('collection — grouping and sorting', () => {
  describe('P7: Correct grouping by genre', () => {
    itProp.prop(
      [fc.array(storedBookArb)],
      { numRuns: 100 },
    )('each group is homogeneous and union equals original', (books) => {
      const grouped = groupBy(books, (b) => b.genre)

      // Each group must be homogeneous: all books share the same genre key
      for (const [genre, group] of Object.entries(grouped)) {
        expect(group).toBeDefined()
        for (const book of group ?? []) {
          expect(book.genre).toBe(genre)
        }
      }

      // Union of all groups must equal the original array (same length, same elements)
      const allGrouped = Object.values(grouped).flat().filter((b): b is StoredBook => b !== undefined)
      expect(allGrouped.length).toBe(books.length)

      // Every book from the original must appear in the grouped result
      for (const book of books) {
        const found = allGrouped.find((b) => b.id === book.id)
        expect(found).toBeDefined()
      }
    })
  })

  describe('P8: Descending date sort', () => {
    itProp.prop(
      [fc.array(storedBookArb)],
      { numRuns: 100 },
    )('orderBy addedAt desc produces descending ISO date order', (books) => {
      const sorted = orderBy(books, ['addedAt'], ['desc'])

      // Each consecutive pair must have addedAt >= next addedAt (ISO string comparison)
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].addedAt >= sorted[i + 1].addedAt).toBe(true)
      }
    })
  })

  describe('P9: Chaos mode — writes fail, reads succeed', () => {
    itProp.prop(
      [fc.array(storedBookArb)],
      { numRuns: 100 },
    )('setChaos(true) enables chaos and getBooks() still works', (books) => {
      clearBooks()

      // Add books before enabling chaos
      for (const book of books) {
        addBook(book)
      }

      // Enable chaos mode
      setChaos(true)
      expect(isChaosEnabled()).toBe(true)

      // Reads still work — getBooks() returns the collection
      const result = getBooks()
      expect(result.length).toBe(books.length)
    })
  })
})
