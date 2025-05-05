<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'error' | 'success' | 'warning'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(true)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
  }, 3000)
})

watch(isVisible, (newValue) => {
  if (!newValue) {
    emit('close')
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      v-if="isVisible"
      class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg"
      :class="{
        'bg-red-100 text-red-800': props.type === 'error',
        'bg-green-100 text-green-800': props.type === 'success',
        'bg-yellow-100 text-yellow-800': props.type === 'warning' || !props.type,
      }"
    >
      {{ props.message }}
    </div>
  </Transition>
</template>
