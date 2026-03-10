import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import * as store from '$lib/server/store'
import { createSampleBooks } from '$lib/fixtures'

export const POST: RequestHandler = async () => {
  store.clearBooks()
  for (const book of createSampleBooks()) {
    store.addBook(book)
  }
  return json({ seeded: store.getBooks().length })
}
