<script setup lang="ts">
import BarChart from '@/components/Chart/BarChart.vue'
import DoughnutChart from '@/components/Chart/DoughnutChart.vue'
import { useHistoryStore } from '@/stores/history.ts'
import { ref, computed } from 'vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useDataFilter } from '@/composables/useDataFilter'

const historyStore = useHistoryStore()
const { formatDateToISO, getCurrentDate, formatDateToDisplay } = useDateFormatter()

const getMinDate = computed(() => {
  const dates = Object.keys(historyStore.history)
  if (!dates.length) return '1970-01-01'

  const sortedDates = dates.sort()
  return formatDateToISO(sortedDates[0]!)
})

const minDate = ref<string>(getMinDate.value)
const maxDate = ref<string>(getCurrentDate.value)

const filteredDatasets = computed(() => {
  const { filterDataByDateRange } = useDataFilter(minDate.value, maxDate.value)
  return filterDataByDateRange(historyStore.getDataset())
})

const chartLabels = computed(() => {
  const datasets = historyStore.getDataset()
  const allDates = datasets
    .flatMap((dataset) => dataset.data.map((item) => item.date))
    .filter((date, index, self) => self.indexOf(date) === index)
    .filter((date) => date >= minDate.value && date <= maxDate.value)
    .sort()
    .map((date) => formatDateToDisplay(date))
  return allDates
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

        <div v-if="Object.keys(historyStore.history).length > 0" class="space-y-8">
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

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">График активности</h2>
              <div class="h-[400px]">
                <BarChart
                  :labels="chartLabels"
                  :datasets="filteredDatasets"
                  :key="filteredDatasets.length"
                />
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Общий прогресс</h2>
              <div class="h-[400px]">
                <DoughnutChart
                  class="block"
                  :labels="['Выполнено', 'Не выполнено']"
                  :datasets="historyStore.getPercentCompletedDataset()"
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">История активности</h2>
            <ul class="space-y-2">
              <template v-for="(objects, date) in historyStore.getOrderedHistory()" :key="date">
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
