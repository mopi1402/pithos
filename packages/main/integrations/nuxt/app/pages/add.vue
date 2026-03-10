<script setup lang="ts">
import { postBook } from '~/lib/api/books'
import { GENRES } from '~/lib/constants'
import type { Book, StoredBook } from '~/lib/types'

const { validateField, clearField, hasError, getError } = useBookValidation()

const form = ref<Record<string, string>>({
  title: '',
  author: '',
  isbn: '',
  genre: '',
  addedAt: '',
})

const error = ref<string | null>(null)
const success = ref<StoredBook | null>(null)

const { execute, pending } = useAsyncAction(async () => {
  error.value = null
  success.value = null

  const book: Book = {
    title: form.value.title,
    author: form.value.author,
    isbn: form.value.isbn,
    genre: form.value.genre,
    ...(form.value.addedAt ? { addedAt: new Date(form.value.addedAt) } : {}),
  }

  try {
    const saved = await postBook(book)
    success.value = saved
    form.value = { title: '', author: '', isbn: '', genre: '', addedAt: '' }
    return { ok: true as const }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong.'
    return { ok: false as const, error: error.value }
  }
})

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'author', label: 'Author', required: true },
  { name: 'isbn', label: 'ISBN', required: true },
  { name: 'genre', label: 'Genre', required: true, options: [...GENRES] },
  { name: 'addedAt', label: 'Date added (optional)', type: 'date' as const },
] as const
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-semibold">
        Add a book
      </h1>
      <NuxtLink
        to="/collection"
        class="text-sm text-zinc-500 hover:text-zinc-700"
      >
        ← Back to collection
      </NuxtLink>
    </div>

    <form class="flex max-w-md flex-col gap-4" @submit.prevent="execute">
      <AlertBanner v-if="error">
        {{ error }}
      </AlertBanner>

      <AlertBanner v-if="success" variant="success">
        &ldquo;{{ success.title }}&rdquo; has been added successfully.
      </AlertBanner>

      <FormField
        v-for="field in fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :type="'type' in field ? field.type : 'text'"
        :options="'options' in field ? (field.options as string[]) : undefined"
        :required="'required' in field ? field.required : false"
        :has-error="hasError(field.name)"
        :error="getError(field.name)"
        :model-value="form[field.name]"
        @update:model-value="form[field.name] = $event"
        @blur="(v: string) => validateField(field.name, v || undefined)"
        @clear="clearField(field.name)"
      />

      <button
        type="submit"
        :disabled="pending"
        class="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {{ pending ? 'Adding...' : 'Add book' }}
      </button>
    </form>
  </div>
</template>
