import type { ErrorRequestHandler } from 'express'
import { CodedError } from '@pithos/core/sphalma/error-factory'
import { DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE } from './errors.js'

const statusMap: Record<number, number> = {
  [DUPLICATE_ISBN]: 409,
  [BOOK_NOT_FOUND]: 404,
  [STORAGE_FAILURE]: 503,
}

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof CodedError) {
    const status = statusMap[err.code] ?? 500
    res.status(status).json({ error: { code: err.code, key: err.key, message: String(err.details) } })
    return
  }
  res.status(500).json({ error: { message: 'Internal server error' } })
}
