<script setup lang="ts">
const enabled = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await $fetch<{ enabled: boolean }>('/api/books/chaos')
    enabled.value = data.enabled
  } catch (err) {
    console.debug('[ChaosToggle]', err)
  } finally {
    loading.value = false
  }
})

async function toggle() {
  const next = !enabled.value
  enabled.value = next
  await $fetch('/api/books/chaos', {
    method: 'POST',
    body: { enabled: next },
  })
}
</script>

<template>
  <button
    v-if="!loading"
    class="flex items-center gap-2 rounded border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700"
    :aria-pressed="enabled"
    @click="toggle"
  >
    <span
      class="inline-block h-2 w-2 rounded-full"
      :class="enabled ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'"
    />
    {{ enabled ? 'Chaos mode ON' : 'Chaos mode' }}
  </button>
</template>
