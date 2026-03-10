import type { bookFields } from '../lib/schemas'

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

export function FormField({
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
  return (
    <div>
      <label class="mb-1 block text-sm font-medium text-zinc-700" for={name}>
        {label}
      </label>
      {options ? (
        <select
          id={name}
          name={name}
          required={required}
          class="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          onBlur={(e) => onBlur(e.currentTarget.value)}
          onInput={onClear}
        >
          <option value="">Select a genre</option>
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
          class="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          onBlur={(e) => onBlur(e.currentTarget.value)}
          onInput={onClear}
        />
      )}
      {hasError && error && (
        <p class="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
