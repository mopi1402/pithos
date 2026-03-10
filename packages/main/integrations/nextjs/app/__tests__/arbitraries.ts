import { fc } from '@fast-check/vitest'

export const ISBN_REGEX = /^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/

export const isbn10Arb = fc.tuple(
  fc.stringMatching(/^\d{9}$/),
  fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'),
).map(([digits, check]) => digits + check)

export const isbn13Arb = fc.tuple(
  fc.stringMatching(/^\d{12}$/),
  fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'),
).map(([digits, check]) => digits + check)

export const isbnArb = fc.oneof(isbn10Arb, isbn13Arb)

export const invalidIsbnArb = fc.string().filter((s) => !ISBN_REGEX.test(s))

export const storedBookArb = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  author: fc.string({ minLength: 1 }),
  isbn: isbn10Arb,
  genre: fc.constantFrom('Fiction', 'Science-Fiction', 'Fantasy', 'Mystery', 'Non-Fiction'),
  addedAt: fc.date({ min: new Date('1970-01-01'), max: new Date('2100-01-01'), noInvalidDate: true }).map(d => d.toISOString()),
})
