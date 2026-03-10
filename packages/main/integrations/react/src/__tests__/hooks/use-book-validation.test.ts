import { describe, expect } from 'vitest'
import { it as itProp, fc } from '@fast-check/vitest'
import { renderHook, act } from '@testing-library/react'
import { useBookValidation } from '../../hooks/use-book-validation'

const fieldNames = ['title', 'author', 'isbn', 'genre'] as const

describe('Error clearing on modification', () => {
  itProp.prop(
    [fc.constantFrom(...fieldNames)],
    { numRuns: 100 },
  )('clearField removes error for any field that had one', (name) => {
    const { result } = renderHook(() => useBookValidation())

    // Set an error by validating with an invalid value (undefined is not a valid string)
    act(() => { result.current.validateField(name, undefined) })
    // Confirm the error was set
    expect(result.current.hasError(name)).toBe(true)

    // Clear the field
    act(() => { result.current.clearField(name) })

    expect(result.current.hasError(name)).toBe(false)
    expect(result.current.getError(name)).toBeUndefined()
  })
})
