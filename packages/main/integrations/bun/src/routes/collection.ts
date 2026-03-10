import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import * as store from '../lib/store.ts'

export function handleGetCollection(_req: Request): Response {
  const books = store.getAll()

  if (books.length === 0) {
    return Response.json([])
  }

  const grouped = groupBy(books, (b) => b.genre)

  const result = Object.entries(grouped).map(([genre, group]) => ({
    genre,
    books: orderBy(group ?? [], ['addedAt'], ['desc']),
  }))

  return Response.json(result)
}
