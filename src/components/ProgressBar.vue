<script setup lang="ts">
import type { ProgressBarProps } from '@/types'
import { computed } from 'vue'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
})

const getProgressValue = computed((): number => {
  return Math.floor((props.value / props.maxValue) * 100)
})
</script>

<template>
  <div class="relative bg-gray-500 h-4 rounded">
    <div
      class="absolute top-0 left-0 h-full duration-300 rounded"
      :class="{
        'bg-red-500': getProgressValue < 30,
        'bg-yellow-500': getProgressValue >= 30 && getProgressValue < 70,
        'bg-green-500': getProgressValue >= 70,
      }"
      :style="{ width: getProgressValue + '%' }"
    ></div>
  </div>
</template>

<style scoped></style>
