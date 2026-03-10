import { fail } from '@sveltejs/kit'
import { groupBy } from '@pithos/core/arkhe/array/group-by'
import { orderBy } from '@pithos/core/arkhe/array/order-by'
import * as store from '$lib/server/store'
import { createSampleBooks } from '$lib/fixtures'

export function load() {
  const books = store.getBooks()
  const grouped = groupBy(books, (b) => b.genre)

  const sortedGroups = Object.fromEntries(
    Object.entries(grouped).map(([genre, group]) => [
      genre,
      orderBy(group ?? [], ['addedAt'], ['desc']),
    ])
  )

  return { groups: sortedGroups, total: books.length }
}

export const actions = {
  seed: async () => {
    store.clearBooks()
    for (const book of createSampleBooks()) {
      store.addBook(book)
    }
    return { seeded: true }
  },

  clear: async () => {
    store.clearBooks()
    return { cleared: true }
  },

  remove: async ({ request }) => {
    if (store.isChaosEnabled()) {
      return fail(503, { error: 'The server is temporarily unavailable. Please try again.' })
    }

    const formData = await request.formData()
    const id = formData.get('id')
    if (typeof id !== 'string' || !id) {
      return fail(400, { error: 'Missing id.' })
    }
    const result = store.removeBook(id)
    if (!result.ok) {
      return fail(404, { error: result.error })
    }
    return { removed: true }
  },
}
