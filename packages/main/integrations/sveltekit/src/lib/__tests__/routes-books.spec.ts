import { describe, expect, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { bookSchema } from '$lib/schemas/book'
import { toStoredBook } from '$lib/server/to-stored-book'
import * as store from '$lib/server/store'
import { bookPayloadArb, isbnArb, genreArb } from './arbitraries'

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
  fc.constant({} as Record<string, unknown>),
)

beforeEach(() => {
  store.clearBooks()
  store.setChaos(false)
})

describe('books route logic', () => {
  describe('POST — valid payload creates a stored book', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('ensure + toStoredBook produces a correctly normalized book', (payload) => {
      store.clearBooks()

      const result = ensure(bookSchema, payload)
      if (result.isErr()) expect.unreachable('expected Ok')

      const storedBook = toStoredBook(result.value)
      store.addBook(storedBook)

      expect(storedBook.id).toBeDefined()
      expect(storedBook.title).toBe(titleCase(payload.title))
      expect(storedBook.author).toBe(titleCase(payload.author))
      expect(storedBook.isbn).toBe(payload.isbn)
      expect(storedBook.genre).toBe(payload.genre)
      expect(storedBook.addedAt).toBeDefined()

      const books = store.getBooks()
      expect(books).toHaveLength(1)
      expect(books[0].id).toBe(storedBook.id)
    })
  })

  describe('POST — invalid payload is rejected', () => {
    itProp.prop(
      [invalidPayloadArb],
      { numRuns: 100 },
    )('ensure(bookSchema, data) returns Err for invalid payloads', (payload) => {
      const result = ensure(bookSchema, payload)
      expect(result.isErr()).toBe(true)
    })
  })

  describe('POST — duplicate ISBN is detected', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('second add with same ISBN is found by findByIsbn', (payload) => {
      store.clearBooks()

      const result = ensure(bookSchema, payload)
      if (result.isErr()) expect.unreachable('expected Ok')

      const storedBook = toStoredBook(result.value)
      store.addBook(storedBook)

      expect(store.findByIsbn(storedBook.isbn)).toBeDefined()
    })
  })

  describe('DELETE — remove by id', () => {
    itProp.prop(
      [bookPayloadArb],
      { numRuns: 100 },
    )('removeBook succeeds for existing id', (payload) => {
      store.clearBooks()

      const result = ensure(bookSchema, payload)
      if (result.isErr()) expect.unreachable('expected Ok')

      const storedBook = toStoredBook(result.value)
      store.addBook(storedBook)

      const removeResult = store.removeBook(storedBook.id)
      expect(removeResult.ok).toBe(true)
      expect(store.getBooks()).toHaveLength(0)
    })
  })

  describe('DELETE — non-existent id fails', () => {
    itProp.prop(
      [fc.uuid()],
      { numRuns: 100 },
    )('removeBook returns ok === false for unknown id', (id) => {
      const result = store.removeBook(id)
      expect(result.ok).toBe(false)
    })
  })
})
