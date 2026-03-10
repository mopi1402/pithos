import { describe, expect, beforeEach } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { getAll, add, remove, clear, findByIsbn } from '../lib/store.js'
import { storedBookArb, isbnArb } from './arbitraries.js'

describe('store', () => {
  beforeEach(() => {
    clear()
  })

  describe('CRUD round-trip', () => {
    itProp.prop(
      [storedBookArb],
      { numRuns: 100 },
    )('add → getAll includes it, remove → getAll excludes it, clear → getAll returns []', (book) => {
      add(book)
      expect(getAll()).toContainEqual(book)

      const removed = remove(book.id)
      expect(removed).toEqual(book)
      expect(getAll()).not.toContainEqual(book)

      add(book)
      clear()
      expect(getAll()).toEqual([])
    })
  })

  describe('lookup for non-existent items', () => {
    itProp.prop(
      [fc.uuid(), isbnArb],
      { numRuns: 100 },
    )('remove(id) and findByIsbn(isbn) return undefined for non-existent items', (id, isbn) => {
      expect(remove(id)).toBeUndefined()
      expect(findByIsbn(isbn)).toBeUndefined()
    })
  })
})
