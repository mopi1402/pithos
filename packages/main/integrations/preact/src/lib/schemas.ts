import { string } from '@pithos/core/kanon/schemas/primitives/string'
import { boolean } from '@pithos/core/kanon/schemas/primitives/boolean'
import { object } from '@pithos/core/kanon/schemas/composites/object'
import { array } from '@pithos/core/kanon/schemas/composites/array'
import { optional } from '@pithos/core/kanon/schemas/wrappers/optional'
import { coerceDate } from '@pithos/core/kanon/schemas/coerce/date'
import type { Infer } from '@pithos/core/kanon/types/base'

export const bookFields = {
  title: string(),
  author: string(),
  isbn: string().pattern(/^(?:\d[\d-]{8}[\dX]|\d[\d-]{11}[\dX])$/, 'Please enter a valid ISBN (10 or 13 digits).'),
  genre: string(),
  addedAt: optional(coerceDate()),
} as const

export const bookSchema = object(bookFields)
export type Book = Infer<typeof bookSchema>

export const storedBookSchema = object({
  id: string(),
  ...bookFields,
  addedAt: string(),
})
export type StoredBook = Infer<typeof storedBookSchema>

export const storedBooksSchema = array(storedBookSchema)
export const chaosSchema = object({ enabled: boolean() })
