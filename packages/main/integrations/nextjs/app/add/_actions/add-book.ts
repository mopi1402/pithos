'use server'

import { ensure } from '@pithos/core/bridges/ensure'
import { revalidatePath } from 'next/cache'
import { bookSchema } from '../../lib/schemas/book'
import type { AddBookState } from '../../lib/types'
import { postBook } from '../../lib/api/books'

export async function addBook(
  _prevState: AddBookState,
  formData: FormData,
): Promise<AddBookState> {
  // FormData.get() returns "" for empty optional fields, not undefined.
  // optional(coerceDate()) needs undefined to treat the field as absent,
  // because coerceDate("") → new Date("") → NaN → validation error.
  const trim = (v: FormDataEntryValue | null) =>
    typeof v === 'string' ? v.trim() : v

  const data = {
    title: trim(formData.get('title')),
    author: trim(formData.get('author')),
    isbn: trim(formData.get('isbn')),
    genre: trim(formData.get('genre')),
    addedAt: formData.get('addedAt') || undefined,
  }

  const result = ensure(bookSchema, data)

  if (result.isErr()) {
    return { success: false, errors: [result.error] }
  }

  const book = result.value

  try {
    const storedBook = await postBook(book)
    revalidatePath('/collection')
    return { success: true, book: storedBook }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred.'
    return { success: false, errors: [message] }
  }
}
