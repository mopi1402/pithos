import { string, object, array, optional, coerceDate, boolean, type Infer } from '@pithos/core/kanon'

// Individual field schemas, reused across book and storedBook schemas
export const bookFields = {
  title: string(),
  author: string(),
  isbn: string().pattern(/^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/, 'Please enter a valid ISBN (10 or 13 digits).'),
  genre: string(),
  addedAt: optional(coerceDate()),
} as const

// Schema for incoming book payload (no id, no addedAt required)
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

// Schema for chaos mode payload
export const chaosSchema = object({ enabled: boolean() })
