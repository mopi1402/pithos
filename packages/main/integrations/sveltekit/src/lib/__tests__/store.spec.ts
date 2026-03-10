import { describe, it, expect, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import {
  getBooks,
  addBook,
  removeBook,
  clearBooks,
  findByIsbn,
  isChaosEnabled,
  setChaos,
} from '$lib/server/store'
import type { StoredBook } from '$lib/types'

const storedBookArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  author: fc.string({ minLength: 1 }),
  isbn: fc.string({ minLength: 1 }),
  genre: fc.string({ minLength: 1 }),
  addedAt: fc.integer({ min: 946684800000, max: 1893455999999 }).map((ts) => new Date(ts).toISOString()),
})

beforeEach(() => {
  clearBooks()
  setChaos(false)
})

describe('in-memory store', () => {
  describe('P4: Store round-trip (add → get)', () => {
    itProp.prop(
      [storedBookArb],
      { numRuns: 100 },
    )('addBook(book) then getBooks() contains the book', (book) => {
      clearBooks()
      const result = addBook(book)
      expect(result.ok).toBe(true)

      const books = getBooks()
      const found = books.find(
        (b) =>
          b.id === book.id &&
          b.isbn === book.isbn &&
          b.title === book.title &&
          b.author === book.author &&
          b.genre === book.genre &&
          b.addedAt === book.addedAt,
      )
      expect(found).toBeDefined()
    })
  })

  describe('P5: Duplicate ISBN detection', () => {
    itProp.prop(
      [storedBookArb],
      { numRuns: 100 },
    )('findByIsbn(isbn) returns the book after addBook', (book) => {
      clearBooks()
      addBook(book)

      const found = findByIsbn(book.isbn)
      expect(found).toBeDefined()
      expect(found?.isbn).toBe(book.isbn)
    })
  })

  describe('P6: Removing absent ISBN fails', () => {
    itProp.prop(
      [fc.string()],
      { numRuns: 100 },
    )('removeBook(isbn) returns ok === false on empty store', (isbn) => {
      clearBooks()
      const result = removeBook(isbn)
      expect(result.ok).toBe(false)
    })
  })

  describe('unit tests — clearBooks and setChaos', () => {
    it('clearBooks() empties the collection', () => {
      const book: StoredBook = {
        id: '00000000-0000-0000-0000-000000000001',
        title: 'Test',
        author: 'Author',
        isbn: '978-0-00-000000-0',
        genre: 'Fiction',
        addedAt: new Date().toISOString(),
      }
      addBook(book)
      expect(getBooks().length).toBe(1)

      clearBooks()
      expect(getBooks().length).toBe(0)
    })

    it('setChaos(true) → isChaosEnabled() === true', () => {
      expect(isChaosEnabled()).toBe(false)
      setChaos(true)
      expect(isChaosEnabled()).toBe(true)
    })
  })
})
