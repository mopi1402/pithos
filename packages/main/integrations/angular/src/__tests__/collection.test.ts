import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import { storedBookWithGenreArb } from './arbitraries'

/**
 * Feature: angular-integration-demo, Property 10: Groupement et tri de la collection
 * Validates: Requirements 9.1, 9.2
 */

describe('Collection grouping and sorting', () => {
  itProp.prop(
    [fc.array(storedBookWithGenreArb, { minLength: 1, maxLength: 20 })],
    { numRuns: 100 },
  )('books are grouped by genre and sorted by addedAt descending', (books) => {
    const grouped = groupBy(books, (b) => b.genre)
    for (const [genre, group] of Object.entries(grouped)) {
      const books_in_group = group ?? []
      for (const book of books_in_group) {
        expect(book.genre).toBe(genre)
      }
      const sorted = orderBy(books_in_group, ['addedAt'], ['desc'])
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].addedAt >= sorted[i].addedAt).toBe(true)
      }
    }
  })
})
