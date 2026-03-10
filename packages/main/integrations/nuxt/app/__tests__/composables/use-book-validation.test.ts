import { describe, expect, vi, beforeAll } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { ref } from 'vue'
import { useBookValidation } from '../../composables/useBookValidation'

const fieldNames = ['title', 'author', 'isbn', 'genre'] as const

// Provide Vue auto-imports that Nuxt normally supplies at runtime
beforeAll(() => {
  vi.stubGlobal('ref', ref)
})

/**
 * Validates: Requirements 11.7
 */
describe('Error clearing on modification', () => {
  itProp.prop(
    [fc.constantFrom(...fieldNames)],
    { numRuns: 100 },
  )('clearField removes error for any field that had one', (name) => {
    const { validateField, clearField, hasError, getError } = useBookValidation()

    // Set an error by validating with an invalid value
    validateField(name, undefined)
    // Confirm the error was set
    expect(hasError(name)).toBe(true)

    // Clear the field
    clearField(name)

    expect(hasError(name)).toBe(false)
    expect(getError(name)).toBeUndefined()
  })
})
