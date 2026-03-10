import { describe, expect, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import * as store from '$lib/server/store'
import { createSampleBooks } from '$lib/fixtures'
import { storedBookArb } from './arbitraries'

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

beforeEach(() => {
  store.clearBooks()
  store.setChaos(false)
})

describe('seed route logic', () => {
  describe('seed replaces store with fixtures regardless of initial state', () => {
    itProp.prop(
      [initialBooksArb],
      { numRuns: 100 },
    )('clearBooks + addBook(fixtures) produces exactly the fixture count', (initialBooks) => {
      store.clearBooks()
      for (const book of initialBooks) store.addBook(book)

      // Simulate seed action
      store.clearBooks()
      const fixtures = createSampleBooks()
      for (const book of fixtures) store.addBook(book)

      const books = store.getBooks()
      expect(books).toHaveLength(fixtures.length)

      // All IDs are unique
      const ids = books.map((b) => b.id)
      expect(new Set(ids).size).toBe(ids.length)

      // All fixture ISBNs are present
      const fixtureIsbns = fixtures.map((b) => b.isbn).sort()
      const storeIsbns = books.map((b) => b.isbn).sort()
      expect(storeIsbns).toEqual(fixtureIsbns)
    })
  })
})
