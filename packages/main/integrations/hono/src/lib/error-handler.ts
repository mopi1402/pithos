import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { CodedError } from '@pithos/core/sphalma/error-factory'
import { DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE } from './errors.js'

const statusMap: Record<number, ContentfulStatusCode> = {
  [DUPLICATE_ISBN]: 409,
  [BOOK_NOT_FOUND]: 404,
  [STORAGE_FAILURE]: 503,
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof CodedError) {
    const status = statusMap[err.code] ?? 500
    return c.json({ error: { code: err.code, key: err.key, message: String(err.details) } }, status)
  }
  return c.json({ error: { message: 'Internal server error' } }, 500)
}
