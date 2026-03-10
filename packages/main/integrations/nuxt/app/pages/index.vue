<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <p class="text-4xl">
      📚
    </p>
    <h1 class="mt-4 text-xl font-semibold">
      Pithos × Nuxt
    </h1>
    <p class="mt-2 text-sm text-zinc-500">
      Book collection manager — Pithos integration demo with Nuxt 3.
    </p>
    <div class="mt-6 flex gap-4">
      <NuxtLink
        to="/add"
        class="rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
      >
        Add a book
      </NuxtLink>
      <NuxtLink
        to="/collection"
        class="rounded border border-zinc-200 px-5 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
      >
        View collection
      </NuxtLink>
    </div>
  </div>
</template>
