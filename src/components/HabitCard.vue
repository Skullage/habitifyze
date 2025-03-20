<script setup lang="ts">
import { onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import ProgressBar from '@/components/ProgressBar.vue'
import { useWeekDays } from '@/composables/useWeekDays'
import { useHabitValue } from '@/composables/useHabitValue'
import type { HabitCardProps, HabitCardEmits } from '@/types'

const props = withDefaults(defineProps<HabitCardProps>(), {
  value: () => [],
  isBooleanType: false,
})

const emits = defineEmits<HabitCardEmits>()

const { weekDays, initializeWeekDays } = useWeekDays()
const { getValue, getProgress, createHistoryData } = useHabitValue(props)

const toggleCheckbox = (index: number, date: string): void => {
  const historyData = createHistoryData(date)
  emits('check', { index, historyData })
}

const handleInput = (index: number, event: Event, date: string): void => {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (!isNaN(value)) {
    const historyData = createHistoryData(date)
    emits('input', { index, value, historyData })
  }
}

const handleDelete = (): void => {
  emits('delete')
}

onMounted(() => {
  initializeWeekDays()
})
</script>

<template>
  <div class="flex flex-col p-4 rounded-lg bg-white shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">{{ props.title }}</h3>
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-600">
          {{ getValue }} / {{ props.target }} {{ props.unit }}
        </div>
        <button
          class="p-2 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          @click="handleDelete"
        >
          <Icon icon="mdi:delete" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <ProgressBar
      class="mb-4"
      :value="getProgress"
      :maxValue="props.target"
      :color="getProgress >= props.target ? 'bg-green-500' : 'bg-blue-500'"
    />

    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, index) in weekDays"
        :key="day.fullDate"
        class="flex flex-col items-center text-sm"
      >
        <span class="text-gray-600">{{ day.dayName }}</span>
        <span class="text-gray-500">{{ day.date }}</span>

        <template v-if="props.isBooleanType">
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            :class="(props.value as boolean[])[index] ? 'bg-green-500 text-white' : 'bg-gray-200'"
            @click="toggleCheckbox(index, day.fullDate)"
          >
            <Icon
              :icon="(props.value as boolean[])[index] ? 'mdi:check' : 'mdi:close'"
              class="w-5 h-5"
            />
          </button>
        </template>
        <input
          v-else
          type="number"
          class="w-8 h-8 border rounded text-center"
          :value="(props.value as number[])[index]"
          @input="handleInput(index, $event, day.fullDate)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
