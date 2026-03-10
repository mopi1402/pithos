import { ensure } from '@pithos/core/bridges/ensure'
import { bookFields } from '../lib/schemas/book'

type FieldName = keyof typeof bookFields
type FieldErrors = Partial<Record<FieldName, string>>

function validateValue(name: FieldName, value: unknown): string | null {
  if (name === 'addedAt' && !value) return null

  const r = ensure(bookFields[name], value)

  return r.isErr() ? r.error : null
}

export function useBookValidation() {
  const errors = ref<FieldErrors>({})
  const touched = new Set<FieldName>()

  function validateField(name: FieldName, value: unknown) {
    touched.add(name)
    const error = validateValue(name, value)
    const next = { ...errors.value }
    if (error) { next[name] = error } else { delete next[name] }
    errors.value = next
  }

  function clearField(name: FieldName) {
    const next = { ...errors.value }
    delete next[name]
    errors.value = next
  }

  const hasError = (name: FieldName) =>
    touched.has(name) && !!errors.value[name]

  const getError = (name: FieldName) =>
    touched.has(name) ? errors.value[name] : undefined

  return { validateField, clearField, hasError, getError }
}
