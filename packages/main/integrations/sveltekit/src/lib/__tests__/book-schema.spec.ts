import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookSchema } from '$lib/schemas/book'

describe('book schema validation', () => {
  describe('P1: Schema round-trip validation', () => {
    // Generate valid ISBN-13: 13 digits
    const isbnArb = fc
      .array(fc.integer({ min: 0, max: 9 }), { minLength: 13, maxLength: 13 })
      .map((digits) => digits.join(''))

    itProp.prop(
      [
        fc.record({
          title: fc.string({ minLength: 1 }),
          author: fc.string({ minLength: 1 }),
          isbn: isbnArb,
          genre: fc.string({ minLength: 1 }),
        }),
      ],
      { numRuns: 100 },
    )('ensure(bookSchema, data) returns Ok for any valid book data', (data) => {
      const result = ensure(bookSchema, data)
      expect(result.isOk()).toBe(true)
    })
  })

  describe('P2: Rejection of invalid data', () => {
    itProp.prop(
      [
        fc.oneof(
          // Missing title
          fc.record({
            author: fc.string({ minLength: 1 }),
            isbn: fc.string({ minLength: 1 }),
            genre: fc.string({ minLength: 1 }),
          }),
          // Missing author
          fc.record({
            title: fc.string({ minLength: 1 }),
            isbn: fc.string({ minLength: 1 }),
            genre: fc.string({ minLength: 1 }),
          }),
          // Missing isbn
          fc.record({
            title: fc.string({ minLength: 1 }),
            author: fc.string({ minLength: 1 }),
            genre: fc.string({ minLength: 1 }),
          }),
          // Missing genre
          fc.record({
            title: fc.string({ minLength: 1 }),
            author: fc.string({ minLength: 1 }),
            isbn: fc.string({ minLength: 1 }),
          }),
          // Wrong types for required fields
          fc.record({
            title: fc.integer(),
            author: fc.integer(),
            isbn: fc.integer(),
            genre: fc.integer(),
          }),
        ),
      ],
      { numRuns: 100 },
    )('ensure(bookSchema, data) returns Err for invalid data', (data) => {
      const result = ensure(bookSchema, data)
      expect(result.isErr()).toBe(true)
    })
  })
})
