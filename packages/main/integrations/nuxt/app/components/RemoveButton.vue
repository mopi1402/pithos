<script setup lang="ts">
import { deleteBook } from '~/lib/api/books'

const props = defineProps<{
  bookId: string
}>()

const emit = defineEmits<{
  error: [message: string]
  removed: []
}>()

const { execute, pending } = useAsyncAction(
  async () => {
    try {
      await deleteBook(props.bookId)
      emit('removed')
      return { ok: true as const }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to remove book.'
      emit('error', msg)
      return { ok: false as const, error: msg }
    }
  },
)
</script>

<template>
  <button
    :disabled="pending"
    class="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
    aria-label="Remove book"
    @click="execute"
  >
    <svg
      v-if="pending"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      class="animate-spin"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <circle cx="5" cy="5" r="4" stroke-dasharray="12" stroke-dashoffset="8" />
    </svg>
    <svg
      v-else
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    >
      <path d="M1 1l8 8M9 1l-8 8" />
    </svg>
  </button>
</template>
