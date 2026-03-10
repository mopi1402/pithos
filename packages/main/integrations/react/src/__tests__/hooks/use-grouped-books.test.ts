import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { renderHook } from '@testing-library/react'
import { useGroupedBooks } from '../../hooks/use-grouped-books'
import { storedBookArb } from '../arbitraries'

describe('Grouping by genre and sorting by date', () => {
  itProp.prop(
    [fc.array(storedBookArb, { minLength: 1, maxLength: 20 })],
    { numRuns: 100 },
  )('invariants hold for any non-empty book list', (books) => {
    const { result } = renderHook(() => useGroupedBooks(books))
    const groups = result.current

    // (a) Each book in a group has the genre matching the group key
    for (const group of groups) {
      for (const book of group.books) {
        expect(book.genre).toBe(group.genre)
      }
    }

    // (b) Dates are in descending order within each group
    for (const group of groups) {
      for (let i = 1; i < group.books.length; i++) {
        expect(group.books[i - 1].addedAt >= group.books[i].addedAt).toBe(true)
      }
    }

    // (c) Union of all groups contains exactly the same books as the original list
    const allGroupedIds = groups.flatMap(g => g.books.map(b => b.id)).sort()
    const originalIds = books.map(b => b.id).sort()
    expect(allGroupedIds).toEqual(originalIds)
  })
})
