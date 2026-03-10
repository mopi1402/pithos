import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import {
  extractErrorFromBody,
  USER_MESSAGES,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../app/lib/errors'

const knownCodes = [DUPLICATE_ISBN, BOOK_NOT_FOUND, STORAGE_FAILURE] as const

describe('Error code to user message mapping', () => {
  itProp.prop(
    [fc.constantFrom(...knownCodes), fc.string({ minLength: 1 }), fc.string({ minLength: 1 })],
    { numRuns: 100 },
  )('known error codes return the corresponding USER_MESSAGES entry', (code, key, message) => {
    const result = extractErrorFromBody({ error: { code, key, message } })
    expect(result).toBe(USER_MESSAGES[code])
  })

  itProp.prop(
    [
      fc.integer().filter((n) => !knownCodes.includes(n as typeof knownCodes[number])),
      fc.string({ minLength: 1 }),
    ],
    { numRuns: 100 },
  )('unknown error codes return the raw message from the body', (code, message) => {
    const result = extractErrorFromBody({ error: { code, key: 'UNKNOWN', message } })
    expect(result).toBe(message)
  })

  itProp.prop(
    [fc.oneof(
      fc.constant(null),
      fc.constant(undefined),
      fc.integer(),
      fc.string(),
      fc.constant([]),
      fc.record({ notError: fc.string() }),
    )],
    { numRuns: 100 },
  )('invalid bodies return the generic fallback message', (body) => {
    const result = extractErrorFromBody(body)
    expect(result).toBe('Something went wrong. Please try again.')
  })
})
