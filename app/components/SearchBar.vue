<template>
  <div class="relative w-full max-w-[560px]">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="w-full py-3.5 pl-5 pr-12 bg-surface border border-border rounded-2xl text-text-base text-base outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_rgb(155_114_207_/0.15)]"
      @input="onInput"
    />
    <button
      v-if="modelValue"
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted cursor-pointer text-sm p-1 transition-colors duration-200 hover:text-text-base"
      type="button"
      @click="onClear"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  clear: []
}>()

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', value)
}

function onClear(): void {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
