import { useMemo } from 'react'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import type { StoredBook } from '../lib/schemas'

export function useGroupedBooks(books: StoredBook[]) {
  return useMemo(() => {
    if (books.length === 0) return []

    const grouped = groupBy(books, (b) => b.genre)

    return Object.entries(grouped).map(([genre, group]) => ({
      genre,
      books: orderBy(group ?? [], ['addedAt'], ['desc']),
    }))
  }, [books])
}
