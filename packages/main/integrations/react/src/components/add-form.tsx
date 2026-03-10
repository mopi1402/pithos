import { useRef, useState } from 'react'
import { ensure } from '@pithos/core/bridges/ensure'
import { titleCase } from '@pithos/core/arkhe/string/title-case'
import { useBookValidation } from '../hooks/use-book-validation'
import { bookSchema } from '../lib/schemas'
import { postBook } from '../lib/api'
import { GENRES } from '../lib/constants'
import { AlertBanner } from './alert-banner'
import { FormField } from './form-field'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'author', label: 'Author', required: true },
  { name: 'isbn', label: 'ISBN', required: true },
  { name: 'genre', label: 'Genre', required: true, options: GENRES },
  { name: 'addedAt', label: 'Date added (optional)', type: 'date' as const },
] as const

export function AddForm() {
  const { validateField, clearField, hasError, getError } = useBookValidation()
  const formRef = useRef<HTMLFormElement>(null)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successTitle, setSuccessTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const fd = new FormData(form)
    const trim = (v: FormDataEntryValue | null) =>
      typeof v === 'string' ? v.trim() : v

    const data = {
      title: trim(fd.get('title')),
      author: trim(fd.get('author')),
      isbn: trim(fd.get('isbn')),
      genre: trim(fd.get('genre')),
      addedAt: fd.get('addedAt') || undefined,
    }

    const result = ensure(bookSchema, data)

    if (result.isErr()) {
      setSubmitState('error')
      setSubmitError(result.error)
      return
    }

    const validated = result.value

    setSubmitState('submitting')
    setSubmitError(null)

    const book = {
      id: crypto.randomUUID(),
      title: titleCase(validated.title),
      author: titleCase(validated.author),
      isbn: validated.isbn,
      genre: validated.genre,
      addedAt: validated.addedAt
        ? validated.addedAt.toISOString()
        : new Date().toISOString(),
    }

    await postBook(book).match(
      () => { setSubmitState('success'); setSuccessTitle(book.title); form.reset() },
      (err) => { setSubmitState('error'); setSubmitError(err) },
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
      {submitState === 'error' && submitError && (
        <AlertBanner variant="error">{submitError}</AlertBanner>
      )}
      {submitState === 'success' && (
        <AlertBanner variant="success">"{successTitle}" has been added successfully.</AlertBanner>
      )}

      {fields.map((field) => (
        <FormField
          key={field.name}
          name={field.name}
          label={field.label}
          type={'type' in field ? field.type : undefined}
          required={'required' in field ? field.required : undefined}
          options={'options' in field ? field.options : undefined}
          hasError={hasError(field.name)}
          error={getError(field.name)}
          onBlur={(v) => validateField(field.name, v || undefined)}
          onClear={() => clearField(field.name)}
        />
      ))}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitState === 'submitting' ? 'Adding...' : 'Add book'}
      </button>
    </form>
  )
}
