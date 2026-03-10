/**
 * Shared fast-check arbitraries for the book collection tests.
 */
import fc from 'fast-check'
import type { StoredBook } from '../lib/schemas.js'

export const genreArb = fc.constantFrom(
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Biography',
  'History',
)

export const isbn10Arb = fc.tuple(
  fc.stringMatching(/^\d{9}$/),
  fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'),
).map(([digits, check]) => digits + check)

export const isbn13Arb = fc.tuple(
  fc.stringMatching(/^\d{12}$/),
  fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'),
).map(([digits, check]) => digits + check)

export const isbnArb = fc.oneof(isbn10Arb, isbn13Arb)

export const storedBookArb: fc.Arbitrary<StoredBook> = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  author: fc.string({ minLength: 1 }),
  isbn: isbnArb,
  genre: genreArb,
  addedAt: fc.integer({ min: 946684800000, max: 1893455999999 }).map((ts) => new Date(ts).toISOString()),
})

export const bookPayloadArb = fc.record({
  title: fc.string({ minLength: 1 }),
  author: fc.string({ minLength: 1 }),
  isbn: isbnArb,
  genre: genreArb,
})

/** Array of stored books with unique ISBNs, at least 1 element. */
export const uniqueStoredBooksArb = fc
  .array(storedBookArb, { minLength: 1, maxLength: 10 })
  .map((books) => {
    const seen = new Set<string>()
    return books.filter((b) => {
      if (seen.has(b.isbn)) return false
      seen.add(b.isbn)
      return true
    })
  })
  .filter((books) => books.length > 0)
