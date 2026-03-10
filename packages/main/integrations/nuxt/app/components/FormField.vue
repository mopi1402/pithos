<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  label: string
  type?: 'text' | 'date'
  options?: string[]
  required?: boolean
  hasError?: boolean
  error?: string
  modelValue?: string
}>(), {
  type: 'text',
  required: false,
  hasError: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [value: string]
  clear: []
}>()

const inputClass = computed(() =>
  `rounded border px-3 py-2 ${props.hasError ? 'border-red-400' : ''}`,
)

function onBlur(e: Event) {
  const target = e.target as HTMLInputElement | HTMLSelectElement
  emit('blur', target.value)
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement | HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('clear')
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="name">{{ label }}</label>
    <select
      v-if="options"
      :id="name"
      :name="name"
      :required="required"
      :class="inputClass"
      :value="modelValue"
      @blur="onBlur"
      @change="onChange"
    >
      <option value="">
        Select a {{ label.toLowerCase() }}
      </option>
      <option v-for="opt in options" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>
    <input
      v-else
      :id="name"
      :name="name"
      :type="type"
      :required="required"
      :class="inputClass"
      :value="modelValue"
      @blur="onBlur"
      @input="onChange"
    >
    <p v-if="error" class="text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>
