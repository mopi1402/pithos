import { useState, useCallback, useRef } from 'preact/hooks'
import { ensure } from '@pithos/core/bridges/ensure'
import { bookFields } from '../lib/schemas'

export type FieldName = keyof typeof bookFields
type FieldErrors = Partial<Record<FieldName, string>>

function validateValue(name: FieldName, value: unknown): string | null {
  if (name === 'addedAt' && !value) return null
  const r = ensure(bookFields[name], value)
  return r.isErr() ? r.error : null
}

export function useBookValidation() {
  const [errors, setErrors] = useState<FieldErrors>({})
  const touched = useRef(new Set<FieldName>())

  const validateField = useCallback((name: FieldName, value: unknown) => {
    touched.current.add(name)
    const error = validateValue(name, value)
    setErrors((prev) => {
      const next = { ...prev }
      if (error) { next[name] = error } else { delete next[name] }
      return next
    })
  }, [])

  const clearField = useCallback((name: FieldName) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const hasError = useCallback(
    (name: FieldName) => touched.current.has(name) && !!errors[name],
    [errors],
  )

  const getError = useCallback(
    (name: FieldName) => (touched.current.has(name) ? errors[name] : undefined),
    [errors],
  )

  return { validateField, clearField, hasError, getError }
}
