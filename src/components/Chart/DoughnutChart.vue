<template>
  <Doughnut
    v-if="
      chartData.datasets[0] && chartData.datasets[0].data[0] && chartData.datasets[0].data[0] > 0
    "
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import type { ChartData } from '@/types'

// Регистрация необходимых компонентов Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

// Пропсы компонента
const props = defineProps<ChartData>()

// Данные для графика
const chartData = {
  labels: props.labels,
  datasets: props.datasets,
}

// Настройки графика
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
