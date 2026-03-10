import { CodedError } from '@pithos/core/sphalma/error-factory'
import {
  createBookError,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../../../app/lib/errors/book-errors'
import { clear, remove, isChaosEnabled } from '../../utils/store'

function maybeFail() {
  if (isChaosEnabled()) {
    throw createBookError(
      STORAGE_FAILURE,
      'Simulated storage failure. The backend is having a bad day.',
    )
  }
}

function sendCodedError(event: Parameters<typeof setResponseStatus>[0], error: CodedError, status: number) {
  setResponseStatus(event, status)
  return { error: { code: error.code, key: error.key, message: String(error.details) } }
}

// ── DELETE /api/books?id=<uuid> ────────────────────────────────────
export default defineEventHandler((event) => {
  try {
    maybeFail()
    const { id } = getQuery(event) as { id?: string }

    if (id === 'all') {
      clear()
      setResponseStatus(event, 204)
      return null
    }

    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'Missing id parameter' }
    }

    const removed = remove(id)
    if (!removed) {
      throw createBookError(BOOK_NOT_FOUND, `No book found with id "${id}".`)
    }

    setResponseStatus(event, 204)
    return null
  } catch (e) {
    if (e instanceof CodedError) {
      const status = e.code === BOOK_NOT_FOUND ? 404 : 503
      return sendCodedError(event, e, status)
    }
    throw e
  }
})
