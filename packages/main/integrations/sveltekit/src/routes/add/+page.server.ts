import { fail } from '@sveltejs/kit'
import type { RequestEvent } from './$types'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookSchema } from '$lib/schemas/book'
import { toStoredBook } from '$lib/server/to-stored-book'
import * as store from '$lib/server/store'

export const actions = {
  default: async ({ request }: RequestEvent) => {
    // 0. Guard chaos mode
    if (store.isChaosEnabled()) {
      return fail(503, { success: false as const, errors: ['The server is temporarily unavailable. Please try again.'] })
    }

    const formData = await request.formData()

    // 1. Extraction — addedAt: "" → undefined for optional()
    const trim = (v: FormDataEntryValue | null) =>
      typeof v === 'string' ? v.trim() : v

    const data = {
      title: trim(formData.get('title')),
      author: trim(formData.get('author')),
      isbn: trim(formData.get('isbn')),
      genre: trim(formData.get('genre')),
      addedAt: formData.get('addedAt') || undefined,
    }

    // 2. Validation — Bridge ensure (Kanon → Zygos)
    const result = ensure(bookSchema, data)
    if (result.isErr()) {
      return fail(400, { success: false as const, errors: [result.error] })
    }

    // 3. Normalization
    const storedBook = toStoredBook(result.value)

    // 4. Duplicate ISBN check
    if (store.findByIsbn(storedBook.isbn)) {
      return fail(409, {
        success: false as const,
        errors: ['A book with this ISBN already exists in your collection.'],
      })
    }

    // 5. Storage
    store.addBook(storedBook)

    return { success: true as const, book: storedBook }
  },
}
