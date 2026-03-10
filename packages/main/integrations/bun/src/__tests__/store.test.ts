import { describe, expect, test, beforeEach } from 'bun:test'
import fc from 'fast-check'
import { getAll, add, remove, clear, findByIsbn } from '../lib/store.ts'
import { storedBookArb, isbnArb } from './arbitraries.ts'

/**
 * Feature: bun-integration-demo, Property 11: CRUD round-trip
 * Validates: Exigence 10.4, 10.5
 */
describe('store', () => {
  beforeEach(() => {
    clear()
  })

  describe('CRUD round-trip', () => {
    test('add → getAll includes it, remove → getAll excludes it, clear → getAll returns []', () => {
      fc.assert(
        fc.property(storedBookArb, (book) => {
          clear()
          add(book)
          expect(getAll()).toContainEqual(book)

          const removed = remove(book.id)
          expect(removed).toEqual(book)
          expect(getAll()).not.toContainEqual(book)

          add(book)
          clear()
          expect(getAll()).toEqual([])
        }),
        { numRuns: 100 },
      )
    })
  })

  describe('lookup for non-existent items', () => {
    test('remove(id) and findByIsbn(isbn) return undefined for non-existent items', () => {
      fc.assert(
        fc.property(fc.uuid(), isbnArb, (id, isbn) => {
          expect(remove(id)).toBeUndefined()
          expect(findByIsbn(isbn)).toBeUndefined()
        }),
        { numRuns: 100 },
      )
    })
  })
})
