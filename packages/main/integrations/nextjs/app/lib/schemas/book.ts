import { string, object, array, optional, coerceDate, boolean, type Infer } from '@pithos/core/kanon'

// Individual field schemas, used client-side for per-field validation
export const bookFields = {
  title: string(),
  author: string(),
  isbn: string().pattern(/^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/, 'Please enter a valid ISBN (10 or 13 digits).'),
  genre: string(),
  addedAt: optional(coerceDate()),
} as const

// Composed schema, used server-side for full payload validation
export const bookSchema = object(bookFields)

export type Book = Infer<typeof bookSchema>

// Schema for stored books (serialized form: addedAt is an ISO string, id is added)
export const storedBookSchema = object({
  id: string(),
  ...bookFields,
  addedAt: string(),
})

export type StoredBook = Infer<typeof storedBookSchema>

export const storedBooksSchema = array(storedBookSchema)

export const chaosSchema = object({ enabled: boolean() })
