<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'error' | 'success'
}>(), {
  variant: 'error',
})

const slots = useSlots()
</script>

<template>
  <div
    v-if="slots.default"
    role="alert"
    :class="variant === 'success'
      ? 'rounded bg-green-50 p-3 text-sm text-green-700'
      : 'rounded bg-red-50 p-3 text-sm text-red-700'"
  >
    <slot />
  </div>
</template>
