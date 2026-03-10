import { Hono } from 'hono'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import * as store from '../lib/store.js'

const collection = new Hono()

collection.get('/', (c) => {
  const books = store.getAll()

  if (books.length === 0) {
    return c.json([])
  }

  const grouped = groupBy(books, (b) => b.genre)

  const result = Object.entries(grouped).map(([genre, group]) => ({
    genre,
    books: orderBy(group ?? [], ['addedAt'], ['desc']),
  }))

  return c.json(result)
})

export default collection
