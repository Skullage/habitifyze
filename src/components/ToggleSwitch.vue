<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="flex items-center">
    <button
      type="button"
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      :class="{
        'bg-blue-500': modelValue,
        'bg-gray-200': !modelValue,
      }"
      role="switch"
      :aria-checked="modelValue"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="{
          'translate-x-5': modelValue,
          'translate-x-0': !modelValue,
        }"
      />
    </button>
    <span v-if="label" class="ml-3 text-sm font-medium text-gray-900">
      {{ label }}
    </span>
  </div>
</template>

<style scoped></style>
