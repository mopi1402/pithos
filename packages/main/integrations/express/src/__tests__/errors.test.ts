import { describe, it, expect } from 'vitest'
import {
  createBookError,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../lib/errors.js'
import { CodedError } from '@pithos/core/sphalma/error-factory'

describe('CodedError serialization', () => {
  const errorCodes = [
    { code: DUPLICATE_ISBN, expectedHex: 0x9001, name: 'DUPLICATE_ISBN' },
    { code: BOOK_NOT_FOUND, expectedHex: 0x9003, name: 'BOOK_NOT_FOUND' },
    { code: STORAGE_FAILURE, expectedHex: 0x9004, name: 'STORAGE_FAILURE' },
  ] as const

  it.each(errorCodes)(
    'createBookError($name) produces a CodedError with correct code, key, and message',
    ({ code }) => {
      const error = createBookError(code)

      expect(error).toBeInstanceOf(CodedError)
      expect(error.code).toBe(code)
      expect(error.key).toBe(`BookCollection:0x${code.toString(16)}`)
      expect(error.message).toBe(`[BookCollection:0x${code.toString(16)}]`)
    },
  )

  it('DUPLICATE_ISBN equals 0x9001', () => {
    expect(DUPLICATE_ISBN).toBe(0x9001)
  })

  it('BOOK_NOT_FOUND equals 0x9003', () => {
    expect(BOOK_NOT_FOUND).toBe(0x9003)
  })

  it('STORAGE_FAILURE equals 0x9004', () => {
    expect(STORAGE_FAILURE).toBe(0x9004)
  })

  it('createBookError attaches details when provided', () => {
    const details = { isbn: '1234567890' }
    const error = createBookError(DUPLICATE_ISBN, details)

    expect(error.details).toEqual(details)
  })

  it('createBookError produces errors with domain BookCollection', () => {
    for (const { code } of errorCodes) {
      const error = createBookError(code)
      expect(error.key).toContain('BookCollection')
    }
  })
})
