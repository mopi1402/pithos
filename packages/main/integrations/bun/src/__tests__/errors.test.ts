import { describe, test, expect } from 'bun:test'
import {
  createBookError,
  DUPLICATE_ISBN,
  BOOK_NOT_FOUND,
  STORAGE_FAILURE,
} from '../lib/errors'

describe('errors — Exigence 4.1', () => {
  const cases = [
    { code: DUPLICATE_ISBN, expectedCode: 0x9001, expectedKey: 'BookCollection:0x9001' },
    { code: BOOK_NOT_FOUND, expectedCode: 0x9003, expectedKey: 'BookCollection:0x9003' },
    { code: STORAGE_FAILURE, expectedCode: 0x9004, expectedKey: 'BookCollection:0x9004' },
  ] as const

  for (const { code, expectedCode, expectedKey } of cases) {
    describe(expectedKey, () => {
      const error = createBookError(code, `Test ${expectedKey}`)

      test('has the correct numeric code', () => {
        expect(error.code).toBe(expectedCode)
      })

      test('has the correct key', () => {
        expect(error.key).toBe(expectedKey)
      })

      test('has a message string', () => {
        expect(typeof error.message).toBe('string')
        expect(error.message.length).toBeGreaterThan(0)
      })
    })
  }
})
