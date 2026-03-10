'use client'

import { useRef, useState, useTransition } from 'react'
import { addBook } from '../_actions/add-book'
import { GENRES } from '../../lib/constants'
import { useBookValidation } from '../../hooks/use-book-validation'
import type { AddBookState } from '../../lib/types'
import AlertBanner from '../../_components/alert-banner'
import FormField from './form-field'

const initialState: AddBookState = { success: false }

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'author', label: 'Author', required: true },
  { name: 'isbn', label: 'ISBN', required: true },
  { name: 'genre', label: 'Genre', required: true, options: GENRES },
  { name: 'addedAt', label: 'Date added (optional)', type: 'date' as const },
] as const

export default function AddForm() {
  const [state, setState] = useState<AddBookState>(initialState)
  const { validateField, clearField, hasError, getError } = useBookValidation()
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await addBook(state, formData)
      setState(result)
      if (result.success) formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {!state.success && state.errors && (
        <AlertBanner>{state.errors.join(', ')}</AlertBanner>
      )}

      {state.success && (
        <AlertBanner variant="success">
          &ldquo;{state.book.title}&rdquo; has been added successfully.
        </AlertBanner>
      )}

      {fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          hasError={hasError(field.name)}
          error={getError(field.name)}
          onBlur={(v) => validateField(field.name, v || undefined)}
          onClear={() => clearField(field.name)}
        />
      ))}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Adding...' : 'Add book'}
      </button>
    </form>
  )
}
