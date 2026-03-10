import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { extractError, USER_MESSAGES } from '../lib/errors/extract-error'
import { DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE } from '../lib/errors/book-errors'

const knownCodes = [DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE] as const

function mockResponse(body: unknown, status = 400, statusText = 'Bad Request'): Response {
  return new Response(JSON.stringify(body), {
    status,
    statusText,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Validates: Requirements 11.4
 */
describe('Error code to user message mapping', () => {
  itProp.prop(
    [fc.constantFrom(...knownCodes), fc.string({ minLength: 1 }), fc.string({ minLength: 1 })],
    { numRuns: 100 },
  )('known error codes return the corresponding USER_MESSAGES entry', async (code, key, message) => {
    const res = mockResponse({ error: { code, key, message } })
    const result = await extractError(res)
    expect(result).toBe(USER_MESSAGES[code])
  })

  itProp.prop(
    [
      fc.integer().filter((n) => !knownCodes.includes(n as typeof knownCodes[number])),
      fc.string({ minLength: 1 }),
    ],
    { numRuns: 100 },
  )('unknown error codes return the raw message from the body', async (code, message) => {
    const res = mockResponse({ error: { code, key: 'UNKNOWN', message } })
    const result = await extractError(res)
    expect(result).toBe(message)
  })

  itProp.prop(
    [fc.string({ minLength: 1 })],
    { numRuns: 100 },
  )('responses without an error code return the raw message', async (message) => {
    const res = mockResponse({ error: { message } })
    const result = await extractError(res)
    expect(result).toBe(message)
  })

  itProp.prop(
    [fc.string({ minLength: 1 })],
    { numRuns: 100 },
  )('non-JSON responses return the generic fallback message', async (statusText) => {
    const res = new Response('not json', { status: 500, statusText })
    const result = await extractError(res)
    expect(result).toBe('Something went wrong. Please try again.')
  })
})
