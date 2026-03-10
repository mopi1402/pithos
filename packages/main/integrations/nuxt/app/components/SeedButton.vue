<script setup lang="ts">
const emit = defineEmits<{
  error: [message: string]
  seeded: []
}>()

const { execute, pending } = useAsyncAction(
  async () => {
    try {
      await $fetch('/api/books/seed', { method: 'POST' })
      emit('seeded')
      return { ok: true as const }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to seed collection.'
      emit('error', msg)
      return { ok: false as const, error: msg }
    }
  },
)
</script>

<template>
  <button
    :disabled="pending"
    class="rounded border border-zinc-200 px-4 py-1.5 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-50"
    @click="execute"
  >
    {{ pending ? 'Seeding...' : 'Load sample books' }}
  </button>
</template>
