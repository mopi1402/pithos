import { CodedError } from '@pithos/core/sphalma/error-factory'
import { DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE } from './errors.ts'

const statusMap: Record<number, number> = {
  [DUPLICATE_ISBN]: 409,
  [BOOK_NOT_FOUND]: 404,
  [STORAGE_FAILURE]: 503,
}

export function handleError(err: unknown): Response {
  if (err instanceof CodedError) {
    const status = statusMap[err.code] ?? 500
    return Response.json(
      { error: { code: err.code, key: err.key, message: String(err.details) } },
      { status },
    )
  }
  return Response.json({ error: { message: 'Internal server error' } }, { status: 500 })
}
