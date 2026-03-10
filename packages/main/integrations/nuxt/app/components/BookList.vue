<script setup lang="ts">
import type { StoredBook } from '~/lib/types'

const props = defineProps<{
  books: StoredBook[]
}>()

const emit = defineEmits<{
  error: [message: string]
  refresh: []
}>()

const groups = useGroupedBooks(computed(() => props.books))

function onRemoved() {
  emit('refresh')
}

function onError(msg: string) {
  emit('error', msg)
}
</script>

<template>
  <div>
    <section v-for="group in groups" :key="group.genre" class="mb-6">
      <h2 class="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-400">
        {{ group.genre }}
      </h2>
      <ul class="space-y-1">
        <li v-for="book in group.books" :key="book.id" class="flex items-center text-sm">
          <span>
            <strong>{{ book.title }}</strong> · {{ book.author }}
            <span class="ml-2 text-zinc-400">ISBN {{ book.isbn }}</span>
          </span>
          <RemoveButton
            :book-id="book.id"
            @error="onError"
            @removed="onRemoved"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
