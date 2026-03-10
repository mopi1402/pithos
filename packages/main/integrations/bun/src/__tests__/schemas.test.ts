import { describe, expect, test } from 'bun:test'
import fc from 'fast-check'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookSchema, storedBookSchema } from '../lib/schemas.ts'
import { storedBookArb, isbnArb } from './arbitraries.ts'

const ISBN_REGEX = /^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/

const invalidIsbnArb = fc.string().filter((s) => !ISBN_REGEX.test(s))

describe('schemas', () => {
  // Feature: bun-integration-demo, Property 1: Schema validation round-trip
  describe('schema validation round-trip', () => {
    test('ensure(storedBookSchema, book) returns success with .value equal to input', () => {
      fc.assert(
        fc.property(storedBookArb, (book) => {
          const result = ensure(storedBookSchema, book)
          expect(result.isOk()).toBe(true)
          if (result.isOk()) {
            expect(result.value).toEqual(book)
          }
        }),
        { numRuns: 100 },
      )
    })
  })

  // Feature: bun-integration-demo, Property 2: ISBN pattern validation
  describe('ISBN pattern validation', () => {
    const validBookBase = {
      title: 'Test Title',
      author: 'Test Author',
      genre: 'Fiction',
    }

    test('succeeds for valid ISBNs', () => {
      fc.assert(
        fc.property(isbnArb, (isbn) => {
          const result = ensure(bookSchema, { ...validBookBase, isbn })
          expect(result.isOk()).toBe(true)
        }),
        { numRuns: 100 },
      )
    })

    test('fails for invalid ISBNs', () => {
      fc.assert(
        fc.property(invalidIsbnArb, (isbn) => {
          const result = ensure(bookSchema, { ...validBookBase, isbn })
          expect(result.isErr()).toBe(true)
        }),
        { numRuns: 100 },
      )
    })
  })
})
