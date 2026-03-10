'use client'

import type { bookFields } from '../../lib/schemas/book'

interface FormFieldProps {
  name: keyof typeof bookFields
  label: string
  type?: 'text' | 'date'
  required?: boolean
  options?: readonly string[]
  hasError: boolean
  error?: string
  onBlur: (value: string) => void
  onClear: () => void
}

export default function FormField({
  name,
  label,
  type = 'text',
  required = false,
  options,
  hasError,
  error,
  onBlur,
  onClear,
}: FormFieldProps) {
  const className = `rounded border px-3 py-2 ${hasError ? 'border-red-400' : ''}`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      {options ? (
        <select
          id={name}
          name={name}
          required={required}
          className={className}
          onBlur={(e) => onBlur(e.target.value)}
          onChange={onClear}
        >
          <option value="">Select a {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className={className}
          onBlur={(e) => onBlur(e.target.value)}
          onChange={onClear}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
