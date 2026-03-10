import { createErrorFactory } from '@pithos/core/sphalma/error-factory'

// ── Business errors (thrown by the API layer) ──────────────────────
const DUPLICATE_ISBN = 0x9001 as const
const COLLECTION_LIMIT = 0x9002 as const
const BOOK_NOT_FOUND = 0x9003 as const
const STORAGE_FAILURE = 0x9004 as const

export const createBookError = createErrorFactory<
  typeof DUPLICATE_ISBN | typeof COLLECTION_LIMIT | typeof BOOK_NOT_FOUND | typeof STORAGE_FAILURE
>('BookCollection')

export { DUPLICATE_ISBN, COLLECTION_LIMIT, BOOK_NOT_FOUND, STORAGE_FAILURE }
