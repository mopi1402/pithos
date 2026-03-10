'use client'

import { useMemo } from 'react'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import type { StoredBook } from '../lib/types'

/**
 * Groups books by genre and sorts each group by date descending.
 * Demonstrates Arkhe utilities (groupBy, orderBy) used client-side
 * as pure data transforms inside a React hook.
 */
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
