import { describe, expect, vi, beforeAll } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ref, computed, unref } from 'vue'
import { useGroupedBooks } from '../../composables/useGroupedBooks'
import { storedBookArb } from '../arbitraries'

// Provide Vue auto-imports that Nuxt normally supplies at runtime
beforeAll(() => {
  vi.stubGlobal('ref', ref)
  vi.stubGlobal('computed', computed)
  vi.stubGlobal('unref', unref)
})

/**
 * Validates: Requirements 11.6
 */
describe('Grouping by genre and sorting by date', () => {
  itProp.prop(
    [fc.array(storedBookArb, { minLength: 1, maxLength: 20 })],
    { numRuns: 100 },
  )('invariants hold for any non-empty book list', (books) => {
    const booksRef = ref(books)
    const grouped = useGroupedBooks(booksRef)
    const groups = grouped.value

    // Property 14: Each book in a group has the genre matching the group key
    for (const group of groups) {
      for (const book of group.books) {
        expect(book.genre).toBe(group.genre)
      }
    }

    // Property 15: Dates are in descending order within each group
    for (const group of groups) {
      for (let i = 1; i < group.books.length; i++) {
        expect(group.books[i - 1].addedAt >= group.books[i].addedAt).toBe(true)
      }
    }

    // Property 16: Union of all groups contains exactly the same books
    const allGroupedIds = groups.flatMap(g => g.books.map(b => b.id)).sort()
    const originalIds = books.map(b => b.id).sort()
    expect(allGroupedIds).toEqual(originalIds)
  })
})
