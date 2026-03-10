import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { Hono } from 'hono'
import { errorHandler } from '../lib/error-handler.js'
import {
  createBookError,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../lib/errors.js'

function createTestApp(errorToThrow: Error) {
  const app = new Hono()
  app.onError(errorHandler)
  app.get('/throw', () => {
    throw errorToThrow
  })
  return app
}

const knownCodeArb = fc.constantFrom(
  { code: DUPLICATE_ISBN, expectedStatus: 409, name: 'DUPLICATE_ISBN' },
  { code: BOOK_NOT_FOUND, expectedStatus: 404, name: 'BOOK_NOT_FOUND' },
  { code: STORAGE_FAILURE, expectedStatus: 503, name: 'STORAGE_FAILURE' },
)

const detailsArb = fc.oneof(fc.string(), fc.constant(undefined))

const nonCodedErrorArb = fc.oneof(
  fc.string().map((msg) => new Error(msg)),
  fc.string().map((msg) => new TypeError(msg)),
  fc.string().map((msg) => new RangeError(msg)),
)

describe('CodedError → correct JSON and HTTP status', () => {
  itProp.prop(
    [knownCodeArb, detailsArb],
    { numRuns: 100 },
  )('handler produces correct JSON structure and HTTP status for CodedError', async ({ code, expectedStatus }, details) => {
    const error = createBookError(code, details)
    const app = createTestApp(error)

    const res = await app.request('/throw')

    expect(res.status).toBe(expectedStatus)

    const body = await res.json()
    expect(body).toEqual({
      error: {
        code: error.code,
        key: error.key,
        message: String(error.details),
      },
    })
  })
})

describe('non-CodedError → 500', () => {
  itProp.prop(
    [nonCodedErrorArb],
    { numRuns: 100 },
  )('handler returns 500 with generic body for non-CodedError', async (error) => {
    const app = createTestApp(error)

    const res = await app.request('/throw')

    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toEqual({
      error: { message: 'Internal server error' },
    })
  })
})
