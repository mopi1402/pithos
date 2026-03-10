import type { Book, StoredBook } from './schemas/book'

export type { Book, StoredBook }

export type AddBookState =
  | { success: true; book: StoredBook }
  | { success: false; errors: string[] }
  | { success: false; errors?: undefined }

/** Generic result for server actions that don't return data. */
export type ActionResult = { ok: true } | { ok: false; error: string }
