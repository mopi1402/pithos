import { describe, expect, test } from 'bun:test'
import fc from 'fast-check'
import { handleError } from '../lib/error-handler.ts'
import {
  createBookError,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../lib/errors.ts'

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

// Feature: bun-integration-demo, Property 3: CodedError → correct HTTP status and JSON structure
describe('CodedError → correct JSON and HTTP status', () => {
  test('handleError produces correct JSON structure and HTTP status for CodedError', async () => {
    await fc.assert(
      fc.asyncProperty(knownCodeArb, detailsArb, async ({ code, expectedStatus }, details) => {
        const error = createBookError(code, details)
        const res = handleError(error)

        expect(res.status).toBe(expectedStatus)

        const body = await res.json()
        expect(body).toEqual({
          error: {
            code: error.code,
            key: error.key,
            message: String(error.details),
          },
        })
      }),
      { numRuns: 100 },
    )
  })
})

// Feature: bun-integration-demo, Property 4: Non-CodedError → 500
describe('non-CodedError → 500', () => {
  test('handleError returns 500 with generic body for non-CodedError', async () => {
    await fc.assert(
      fc.asyncProperty(nonCodedErrorArb, async (error) => {
        const res = handleError(error)

        expect(res.status).toBe(500)

        const body = await res.json()
        expect(body).toEqual({
          error: { message: 'Internal server error' },
        })
      }),
      { numRuns: 100 },
    )
  })
})
