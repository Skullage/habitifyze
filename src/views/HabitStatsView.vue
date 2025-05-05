<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useHistoryStore } from '@/stores/history.ts'
import BarChart from '@/components/Chart/BarChart.vue'
import Notification from '@/components/Notification.vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useDataFilter } from '@/composables/useDataFilter'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const historyStore = useHistoryStore()
const { formatDateToDisplay, getCurrentDate } = useDateFormatter()

const habitName = computed(() => route.params['name'] as string)

const getMinDate = computed(() => {
  const datasets = historyStore.getDataset()
  const habitDataset = datasets.find((d) => d.label === habitName.value)
  if (!habitDataset) return '1970-01-01'

  const dates = habitDataset.data.map((item) => item.date).filter(Boolean)
  if (!dates.length) return '1970-01-01'

  const sortedDates = dates.sort()
  const firstDate = sortedDates[0]
  if (!firstDate) return '1970-01-01'

  return firstDate
})

const minDate = ref<string>(loadFromStorage('statsMinDate') || getMinDate.value)
const maxDate = ref<string>(loadFromStorage('statsMaxDate') || getCurrentDate.value)

// Функция для валидации даты
const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date.getTime())
}

// Функция для нормализации даты
const normalizeDate = (dateStr: string): string => {
  if (!isValidDate(dateStr)) {
    return getCurrentDate.value
  }

  const date = new Date(dateStr)
  // Проверяем, что год находится в разумных пределах
  const year = date.getFullYear()
  if (year < 1970 || year > 2100) {
    return getCurrentDate.value
  }

  const isoDate = date.toISOString().split('T')[0]
  return isoDate || getCurrentDate.value
}

// Кэшируем данные для оптимизации
const cachedDatasets = ref<any[]>([])
const cachedLabels = ref<string[]>([])

const showNotification = ref(false)
const notificationMessage = ref('')

const handleNotificationClose = () => {
  showNotification.value = false
  notificationMessage.value = ''
}

const updateChartData = () => {
  try {
    // Проверяем, что минимальная дата не меньше getMinDate
    if (new Date(minDate.value) < new Date(getMinDate.value)) {
      minDate.value = getMinDate.value
      notificationMessage.value =
        'Дата не может быть раньше ' + formatDateToDisplay(getMinDate.value)
      showNotification.value = true
      return
    }

    // Нормализуем даты перед использованием
    const normalizedMinDate = normalizeDate(minDate.value)
    const normalizedMaxDate = normalizeDate(maxDate.value)

    const { filterDataByDateRange } = useDataFilter(normalizedMinDate, normalizedMaxDate)
    const datasets = historyStore.getDataset()
    const habitDataset = datasets.find((d) => d.label === habitName.value)

    if (!habitDataset) {
      cachedDatasets.value = []
      cachedLabels.value = []
      return
    }

    // Получаем все даты в выбранном диапазоне
    const allDates: string[] = []
    const currentDate = new Date(normalizedMinDate)
    const endDate = new Date(normalizedMaxDate)

    // Проверяем, что даты в правильном порядке
    if (currentDate > endDate) {
      cachedDatasets.value = []
      cachedLabels.value = []
      return
    }

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      if (dateStr) allDates.push(dateStr)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Создаем новый набор данных с нулевыми значениями для пропущенных дней
    const newDataset = {
      ...habitDataset,
      data: allDates.map((date) => {
        const existingData = habitDataset.data.find((d) => d.date === date)
        return {
          date: date as string,
          value: existingData ? existingData.value : 0,
        }
      }),
    }

    cachedDatasets.value = filterDataByDateRange([newDataset])
    cachedLabels.value = allDates.map((date) => formatDateToDisplay(date))
  } catch (error) {
    console.error('Ошибка при обновлении данных графика:', error)
    cachedDatasets.value = []
    cachedLabels.value = []
  }
}

// Следим за изменениями дат с задержкой
let updateTimeout: number | null = null
watch([minDate, maxDate], () => {
  if (updateTimeout) {
    clearTimeout(updateTimeout)
  }
  updateTimeout = setTimeout(() => {
    updateChartData()
    // Сохраняем значения фильтра
    saveToStorage('statsMinDate', minDate.value)
    saveToStorage('statsMaxDate', maxDate.value)
  }, 300)
})

// Инициализируем данные при монтировании
updateChartData()

const filteredDatasets = computed(() => cachedDatasets.value)
const chartLabels = computed(() => cachedLabels.value)
</script>

<template>
  <main class="h-full bg-gray-50">
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      type="warning"
      @close="handleNotificationClose"
    />
    <div class="container py-8">
      <div class="max-w-4xl mx-auto">
        <div class="pb-4 mb-8">
          <h1 class="text-center text-4xl font-bold text-gray-800 mb-2">{{ habitName }}</h1>
          <button
            @click="router.push('/')"
            class="text-green-600 hover:text-green-700 flex items-center gap-2 mx-auto cursor-pointer duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Назад
          </button>
        </div>

        <div class="space-y-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <fieldset class="text-center space-y-4">
              <legend class="text-lg font-semibold text-gray-700 mb-4">Выберите период</legend>
              <div class="flex justify-center gap-4 flex-wrap">
                <label class="flex flex-col items-center">
                  <span class="text-sm text-gray-600 mb-1">С</span>
                  <input
                    type="date"
                    v-model="minDate"
                    :min="getMinDate"
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
            <h2 class="text-xl font-semibold text-gray-800 mb-4">График активности</h2>
            <div class="h-[400px]">
              <template v-if="filteredDatasets.length > 0">
                <BarChart
                  :labels="chartLabels"
                  :datasets="filteredDatasets"
                  :key="filteredDatasets.length"
                />
              </template>
              <template v-else>
                <p class="text-center text-gray-600">Нет данных для отображения</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
