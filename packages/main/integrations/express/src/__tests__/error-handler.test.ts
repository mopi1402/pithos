import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import express from 'express'
import request from 'supertest'
import { errorMiddleware } from '../lib/error-handler.js'
import {
  createBookError,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../lib/errors.js'

function createTestApp(errorToThrow: Error) {
  const app = express()
  app.get('/throw', () => {
    throw errorToThrow
  })
  app.use(errorMiddleware)
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

// Feature: express-integration-demo, Property 3: CodedError serialization
// **Validates: Requirements 4.3, 4.4, 11.2**
describe('CodedError → correct JSON and HTTP status', () => {
  itProp.prop(
    [knownCodeArb, detailsArb],
    { numRuns: 100 },
  )('handler produces correct JSON structure and HTTP status for CodedError', async ({ code, expectedStatus }, details) => {
    const error = createBookError(code, details)
    const app = createTestApp(error)

    const res = await request(app).get('/throw')

    expect(res.status).toBe(expectedStatus)
    expect(res.body).toEqual({
      error: {
        code: error.code,
        key: error.key,
        message: String(error.details),
      },
    })
  })
})

// Feature: express-integration-demo, Property 14: Non-CodedError → 500
// **Validates: Requirement 11.3**
describe('non-CodedError → 500', () => {
  itProp.prop(
    [nonCodedErrorArb],
    { numRuns: 100 },
  )('handler returns 500 with generic body for non-CodedError', async (error) => {
    const app = createTestApp(error)

    const res = await request(app).get('/throw')

    expect(res.status).toBe(500)
    expect(res.body).toEqual({
      error: { message: 'Internal server error' },
    })
  })
})
