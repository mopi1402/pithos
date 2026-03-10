<template>
  <div>
    <nav class="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div class="mx-auto flex max-w-3xl items-center justify-between">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight">
          Pithos × Nuxt
        </NuxtLink>
        <ChaosToggle />
      </div>
    </nav>
    <div class="mx-auto max-w-3xl px-6 py-8">
      <NuxtPage />
    </div>
  </div>
</template>
