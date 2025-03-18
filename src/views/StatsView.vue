<script setup lang="ts">
import BarChart, { type DataSet } from '@/components/Chart/BarChart.vue'
import DoughnutChart from '@/components/Chart/DoughnutChart.vue'
import { useHistoryStore, type DataSetPrerender } from '@/stores/history.ts'
import { ref, computed } from 'vue'

const historyStore = useHistoryStore()

const getCurrentDate = computed((): string => {
  return new Date().toISOString().split('T')[0]
})

const minDate = ref<string>('1970-01-01')
const maxDate = ref<string>(getCurrentDate.value)

const filteredDatasets = computed(() => {
  return getFilteredValue(historyStore.getDataset())
})

const getFilteredValue = (value: DataSetPrerender[]): DataSet[] => {
  return value
    .map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((item) => {
        const itemDate = new Date(item.date)
        const minDateValue = new Date(minDate.value || '1970-01-01')
        const maxDateValue = new Date(maxDate.value || getCurrentDate.value)
        return itemDate >= minDateValue && itemDate <= maxDateValue
      }),
    }))
    .map((el) => {
      return {
        label: el.label,
        data: el.data.map((item) => item.value), // Преобразуем данные в массив чисел
        backgroundColor: el.backgroundColor,
        borderColor: el.borderColor,
        borderWidth: el.borderWidth,
      }
    })
}
</script>
<template>
  <main class="h-full">
    <div class="container">
      <div>
        <div class="pb-4 mb-8">
          <h1 class="text-center text-3xl font-bold">Ваш прогресс</h1>
        </div>
        <div>
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
            :labels="historyStore.getDates()"
            :datasets="filteredDatasets"
            :key="filteredDatasets.length"
          />
        </div>
        <div>
          <DoughnutChart
            class="block"
            :labels="['Выполнено']"
            :datasets="historyStore.getPercentCompletedDataset()"
          />
        </div>
        <div v-if="Object.keys(historyStore.history).length > 0">
          <h2 class="text-2xl">История:</h2>
          <ul>
            <template v-for="(objects, date) in historyStore.getOrderedHistory()" :key="date">
              <li v-for="(obj, index) in objects" :key="index">
                <p v-if="obj.goal">
                  {{ `${date} - ${obj.name} - Выполнено ${obj.sum}/${obj.goal}` }}
                </p>
                <p v-else>
                  {{ `${date} - ${obj.name} - ${obj.completed ? 'Выполнено' : 'Не выполнено'}` }}
                </p>
              </li>
            </template>
          </ul>
        </div>
        <div v-else>Нет данных</div>
      </div>
    </div>
  </main>
</template>
