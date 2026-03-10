import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import type { StoredBook } from '../lib/types'

/**
 * Groups books by genre and sorts each group by date descending.
 * Demonstrates Arkhe utilities (groupBy, orderBy) used client-side
 * as pure data transforms inside a Vue composable.
 */
export function useGroupedBooks(books: Ref<StoredBook[]> | ComputedRef<StoredBook[]>) {
  return computed(() => {
    const list = unref(books)
    if (list.length === 0) return []

    const grouped = groupBy(list, (b) => b.genre)

    return Object.entries(grouped).map(([genre, group]) => ({
      genre,
      books: orderBy(group ?? [], ['addedAt'], ['desc']),
    }))
  })
}
