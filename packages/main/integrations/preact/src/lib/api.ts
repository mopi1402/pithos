import { ensurePromise } from '@pithos/core/bridges/ensurePromise'
import { err } from '@pithos/core/zygos/result/result'
import { ResultAsync, okAsync } from '@pithos/core/zygos/result/result-async'
import { storedBooksSchema, storedBookSchema, chaosSchema } from './schemas'
import type { StoredBook } from './schemas'
import { extractError } from './errors'
import { API_URL } from './constants'

function url(path = '') {
  return `${API_URL}${path}`
}

/** Prefix used to identify connection errors in the UI layer. */
export const CONNECTION_ERROR_PREFIX = 'CONNECTION_ERROR:'

/**
 * Wrapper around fetch that catches network errors (backend unreachable)
 * and returns a prefixed error so the UI can render a rich component.
 */
function safeFetch(input: string, init?: RequestInit): ResultAsync<Response, string> {
  return ResultAsync.fromPromise(
    fetch(input, init),
    (e) => e instanceof TypeError
      ? `${CONNECTION_ERROR_PREFIX}${API_URL}`
      : String(e),
  )
}

/** Converts a non-ok Response into an Err with a user-friendly message. */
function checkResponse(res: Response): ResultAsync<Response, string> {
  if (res.ok) return okAsync(res)
  return new ResultAsync(extractError(res).then((msg) => err(msg)))
}

export function fetchBooks(): ResultAsync<StoredBook[], string> {
  return safeFetch(url('/books'))
    .andThen(checkResponse)
    .andThen((res) => ensurePromise(storedBooksSchema, res.json()))
}

export function postBook(book: StoredBook): ResultAsync<StoredBook, string> {
  return safeFetch(url('/books'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
    .andThen(checkResponse)
    .andThen((res) => ensurePromise(storedBookSchema, res.json()))
}

export function deleteBook(id: string): ResultAsync<void, string> {
  return safeFetch(url(`/books?id=${id}`), { method: 'DELETE' })
    .andThen(checkResponse)
    .map(() => {})
}

export function deleteAllBooks(): ResultAsync<void, string> {
  return safeFetch(url('/books?id=all'), { method: 'DELETE' })
    .andThen(checkResponse)
    .map(() => {})
}

export function seedBooks(): ResultAsync<StoredBook[], string> {
  return safeFetch(url('/books/seed'), { method: 'POST' })
    .andThen(checkResponse)
    .andThen((res) => ensurePromise(storedBooksSchema, res.json()))
}

export function getChaos(): ResultAsync<boolean, string> {
  return safeFetch(url('/books/chaos'))
    .andThen(checkResponse)
    .andThen((res) => ensurePromise(chaosSchema, res.json()))
    .map((data) => data.enabled)
}

export function setChaos(enabled: boolean): ResultAsync<boolean, string> {
  return safeFetch(url('/books/chaos'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
    .andThen(checkResponse)
    .andThen((res) => ensurePromise(chaosSchema, res.json()))
    .map((data) => data.enabled)
}
