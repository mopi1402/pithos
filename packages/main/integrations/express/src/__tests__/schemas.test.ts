import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookSchema, storedBookSchema } from '../lib/schemas.js'
import { storedBookArb, isbnArb } from './arbitraries.js'

const ISBN_REGEX = /^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/

const invalidIsbnArb = fc.string().filter((s) => !ISBN_REGEX.test(s))

describe('schemas', () => {
  describe('schema validation round-trip', () => {
    itProp.prop(
      [storedBookArb],
      { numRuns: 100 },
    )('ensure(storedBookSchema, book) returns success with .value equal to input', (book) => {
      /**
       * **Validates: Requirements 3.1, 3.2, 3.3, 5.1**
       * Feature: express-integration-demo, Property 1: Schema validation round-trip
       */
      const result = ensure(storedBookSchema, book)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value).toEqual(book)
      }
    })
  })

  describe('ISBN pattern validation', () => {
    const validBookBase = {
      title: 'Test Title',
      author: 'Test Author',
      genre: 'Fiction',
    }

    itProp.prop(
      [isbnArb],
      { numRuns: 100 },
    )('succeeds for valid ISBNs', (isbn) => {
      /**
       * **Validates: Requirement 3.5**
       * Feature: express-integration-demo, Property 2: ISBN pattern validation (valid)
       */
      const result = ensure(bookSchema, { ...validBookBase, isbn })
      expect(result.isOk()).toBe(true)
    })

    itProp.prop(
      [invalidIsbnArb],
      { numRuns: 100 },
    )('fails for invalid ISBNs', (isbn) => {
      /**
       * **Validates: Requirement 3.5**
       * Feature: express-integration-demo, Property 2: ISBN pattern validation (invalid)
       */
      const result = ensure(bookSchema, { ...validBookBase, isbn })
      expect(result.isErr()).toBe(true)
    })
  })
})
