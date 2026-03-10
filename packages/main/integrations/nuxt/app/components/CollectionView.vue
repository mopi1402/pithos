<script setup lang="ts">
import type { StoredBook } from '~/lib/types'

defineProps<{
  books: StoredBook[]
}>()

const emit = defineEmits<{
  refresh: []
}>()

const error = ref<string | null>(null)

function onError(msg: string) {
  error.value = msg
}

function onRefresh() {
  error.value = null
  emit('refresh')
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-semibold">
        My collection
        <span class="ml-2 text-sm font-normal text-zinc-400">
          {{ books.length }} {{ books.length === 1 ? 'book' : 'books' }}
        </span>
      </h1>
      <div class="flex items-center gap-4">
        <SeedButton @error="onError" @seeded="onRefresh" />
        <ClearButton @error="onError" @cleared="onRefresh" />
        <NuxtLink
          to="/add"
          class="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Add a book
        </NuxtLink>
      </div>
    </div>
    <AlertBanner v-if="error">
      {{ error }}
    </AlertBanner>
    <BookList
      :books="books"
      @error="onError"
      @refresh="onRefresh"
    />
  </div>
</template>
