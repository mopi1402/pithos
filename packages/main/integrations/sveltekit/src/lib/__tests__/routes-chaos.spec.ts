import { describe, expect, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookSchema } from '$lib/schemas/book'
import { toStoredBook } from '$lib/server/to-stored-book'
import * as store from '$lib/server/store'
import { bookPayloadArb } from './arbitraries'

beforeEach(() => {
  store.clearBooks()
  store.setChaos(false)
})

describe('chaos route logic', () => {
  describe('chaos state round-trip', () => {
    itProp.prop(
      [fc.boolean()],
      { numRuns: 100 },
    )('setChaos(b) then isChaosEnabled() returns b', (b) => {
      store.setChaos(b)
      expect(store.isChaosEnabled()).toBe(b)
    })
  })

  describe('chaos mode blocks writes, reads still work', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('with chaos enabled, getBooks() still returns data', (payload) => {
      store.clearBooks()

      // Add a book before enabling chaos
      const result = ensure(bookSchema, payload)
      if (result.isErr()) expect.unreachable('expected Ok')
      const storedBook = toStoredBook(result.value)
      store.addBook(storedBook)

      // Enable chaos
      store.setChaos(true)
      expect(store.isChaosEnabled()).toBe(true)

      // Reads still work
      const books = store.getBooks()
      expect(books).toHaveLength(1)
      expect(books[0].isbn).toBe(storedBook.isbn)
    })
  })
})
