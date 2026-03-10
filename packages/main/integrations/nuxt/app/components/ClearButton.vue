<script setup lang="ts">
import { deleteAllBooks } from '~/lib/api/books'

const emit = defineEmits<{
  error: [message: string]
  cleared: []
}>()

const { execute, pending } = useAsyncAction(
  async () => {
    try {
      await deleteAllBooks()
      emit('cleared')
      return { ok: true as const }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to clear collection.'
      emit('error', msg)
      return { ok: false as const, error: msg }
    }
  },
)
</script>

<template>
  <button
    :disabled="pending"
    class="text-xs text-zinc-400 hover:text-red-500 disabled:opacity-50"
    @click="execute"
  >
    {{ pending ? 'Clearing...' : 'Clear all' }}
  </button>
</template>
