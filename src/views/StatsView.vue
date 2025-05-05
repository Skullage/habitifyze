<script setup lang="ts">
import { useHistoryStore } from '@/stores/history.ts'
import { ref, computed, watch } from 'vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import type { HabitHistory } from '@/types'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

const historyStore = useHistoryStore()
const { formatDateToISO, getCurrentDate } = useDateFormatter()

const getMinDate = computed(() => {
  const dates = Object.keys(historyStore.history)
  if (!dates.length) return '1970-01-01'

  const sortedDates = dates.sort()
  return formatDateToISO(sortedDates[0]!)
})

const minDate = ref<string>(loadFromStorage('statsMinDate') || getMinDate.value)
const maxDate = ref<string>(loadFromStorage('statsMaxDate') || getCurrentDate.value)

// Следим за изменениями дат с задержкой
let updateTimeout: number | null = null
watch([minDate, maxDate], () => {
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
  updateTimeout = setTimeout(() => {
    // Сохраняем значения фильтра
    saveToStorage('statsMinDate', minDate.value)
    saveToStorage('statsMaxDate', maxDate.value)
  }, 300)
})

const filteredHistory = computed(() => {
  const orderedHistory = historyStore.filteredHistoryByDate(minDate.value, maxDate.value)
  const filtered: HabitHistory = {}

  Object.entries(orderedHistory).forEach(([date, items]) => {
    if (
      items[0] &&
      !(
        (typeof items[0].value === 'boolean' && items[0].value === false) ||
        (typeof items[0].value === 'number' && items[0].value <= 0)
      )
    ) {
      filtered[date] = items
    }
  })
  return filtered
})
</script>
<template>
  <main class="h-full bg-gray-50">
    <div class="container py-8">
      <div class="max-w-4xl mx-auto">
        <div class="pb-4 mb-8">
          <h1 class="text-center text-4xl font-bold text-gray-800 mb-2">Ваш прогресс</h1>
          <p class="text-center text-gray-600">
            Отслеживайте свои достижения и анализируйте результаты
          </p>
        </div>

        <div v-if="Object.keys(filteredHistory).length > 0" class="space-y-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <fieldset class="text-center space-y-4">
              <legend class="text-lg font-semibold text-gray-700 mb-4">Выберите период</legend>
              <div class="flex justify-center gap-4 flex-wrap">
                <label class="flex flex-col items-center">
                  <span class="text-sm text-gray-600 mb-1">С</span>
                  <input
                    type="date"
                    v-model="minDate"
                    class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </label>
                <label class="flex flex-col items-center">
                  <span class="text-sm text-gray-600 mb-1">По</span>
                  <input
                    type="date"
                    v-model="maxDate"
                    class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </label>
              </div>
            </fieldset>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">История активности</h2>
            <ul class="space-y-2">
              <template v-for="(objects, date) in filteredHistory" :key="date">
                <li
                  v-for="(obj, index) in objects"
                  :key="index"
                  class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p v-if="typeof obj.value !== 'boolean'" class="text-gray-700">
                    <span class="font-medium">{{ date }}</span> -
                    <span class="text-green-600">{{ obj.name }}</span> - Выполнено
                    <span class="font-semibold">{{ obj.value }}</span>
                  </p>
                  <p v-else class="text-gray-700">
                    <span class="font-medium">{{ date }}</span> -
                    <span class="text-green-600">{{ obj.name }}</span> -
                    <span :class="obj.completed ? 'text-green-600' : 'text-red-600'">
                      {{ obj.completed ? 'Выполнено' : 'Не выполнено' }}
                    </span>
                  </p>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="bg-white rounded-lg shadow-md p-8">
            <p class="text-xl text-gray-600">Нет данных для отображения</p>
            <p class="text-sm text-gray-500 mt-2">
              Начните отслеживать привычки, чтобы увидеть статистику
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
