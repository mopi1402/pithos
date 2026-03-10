<script setup lang="ts">
import type { StoredBook } from '~/lib/types'

const { data: books, refresh } = await useFetch<StoredBook[]>('/api/books')

function onRefresh() {
  refresh()
}
</script>

<template>
  <div>
    <div v-if="!books || books.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
      <p class="text-4xl">
        📚
      </p>
      <h1 class="mt-4 text-xl font-semibold">
        Your collection is empty
      </h1>
      <p class="mt-2 text-sm text-zinc-500">
        Add your first book to get started.
      </p>
      <NuxtLink
        to="/add"
        class="mt-6 rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
      >
        Add a book
      </NuxtLink>
      <div class="mt-3">
        <SeedButton @seeded="onRefresh" />
      </div>
    </div>

    <CollectionView
      v-else
      :books="books"
      @refresh="onRefresh"
    />
  </div>
</template>
