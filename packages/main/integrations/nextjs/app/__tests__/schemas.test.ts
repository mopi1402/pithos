import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookFields } from '../lib/schemas/book'
import { isbnArb, invalidIsbnArb } from './arbitraries'

describe('Per-field validation via ensure', () => {
  describe('valid values produce Ok', () => {
    itProp.prop(
      [fc.constantFrom('title' as const, 'author' as const, 'genre' as const), fc.string()],
      { numRuns: 100 },
    )('string fields accept any string value', (name, value) => {
      const result = ensure(bookFields[name], value)
      expect(result.isOk()).toBe(true)
    })

    itProp.prop(
      [isbnArb],
      { numRuns: 100 },
    )('isbn accepts valid ISBN strings', (isbn) => {
      const result = ensure(bookFields.isbn, isbn)
      expect(result.isOk()).toBe(true)
    })

    itProp.prop(
      [fc.date({ min: new Date('1970-01-01'), max: new Date('2100-01-01'), noInvalidDate: true })],
      { numRuns: 100 },
    )('addedAt accepts valid Date objects', (date) => {
      const result = ensure(bookFields.addedAt, date)
      expect(result.isOk()).toBe(true)
    })

    itProp.prop(
      [fc.constant(undefined)],
      { numRuns: 1 },
    )('addedAt accepts undefined (optional)', (value) => {
      const result = ensure(bookFields.addedAt, value)
      expect(result.isOk()).toBe(true)
    })
  })

  describe('invalid values produce Err', () => {
    itProp.prop(
      [
        fc.constantFrom('title' as const, 'author' as const, 'genre' as const, 'isbn' as const),
        fc.oneof(fc.integer(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
      ],
      { numRuns: 100 },
    )('string-based fields reject non-string values', (name, value) => {
      const result = ensure(bookFields[name], value)
      expect(result.isErr()).toBe(true)
    })

    itProp.prop(
      [invalidIsbnArb],
      { numRuns: 100 },
    )('isbn rejects strings not matching ISBN pattern', (value) => {
      const result = ensure(bookFields.isbn, value)
      expect(result.isErr()).toBe(true)
    })

    itProp.prop(
      [fc.oneof(fc.constant(null), fc.constant('not-a-date'), fc.constant(''))],
      { numRuns: 100 },
    )('addedAt rejects invalid non-undefined values', (value) => {
      const result = ensure(bookFields.addedAt, value)
      expect(result.isErr()).toBe(true)
    })
  })
})
