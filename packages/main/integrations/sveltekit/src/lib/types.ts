import type { StoredBook } from './schemas/book'

export type { StoredBook }

// State returned by the form action to the form
export type AddBookState =
  | { success: true; book: StoredBook }
  | { success: false; errors: string[] }
  | { success: false; errors?: undefined }
