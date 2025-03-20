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
  <main class="h-full">
    <div class="container">
      <div>
        <div class="pb-4 mb-8">
          <h1 class="text-center text-3xl font-bold">Ваш прогресс</h1>
        </div>
        <div v-if="Object.keys(historyStore.history).length > 0">
          <fieldset class="text-center">
            <legend>Выберите период</legend>
            <label
              >С
              <input type="date" v-model="minDate" />
            </label>
            <label>
              По
              <input type="date" v-model="maxDate" />
            </label>
          </fieldset>
        </div>
        <div>
          <BarChart
            :labels="chartLabels"
            :datasets="filteredDatasets"
            :key="filteredDatasets.length"
          />
        </div>
        <div>
          <DoughnutChart
            class="block"
            :labels="['Выполнено', 'Не выполнено']"
            :datasets="historyStore.getPercentCompletedDataset()"
          />
        </div>
        <div v-if="Object.keys(historyStore.history).length > 0">
          <h2 class="text-2xl">История:</h2>
          <ul>
            <template v-for="(objects, date) in historyStore.getOrderedHistory()" :key="date">
              <li v-for="(obj, index) in objects" :key="index">
                <p v-if="typeof obj.value !== 'boolean'">
                  {{ `${date} - ${obj.name} - Выполнено ${obj.value}` }}
                </p>
                <p v-else>
                  {{ `${date} - ${obj.name} - ${obj.completed ? 'Выполнено' : 'Не выполнено'}` }}
                </p>
              </li>
            </template>
          </ul>
        </div>
        <div class="text-center" v-else>Нет данных</div>
      </div>
    </div>
  </main>
</template>
