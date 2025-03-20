<template>
  <Bar
    v-if="chartData.datasets[0] && chartData.datasets[0].data.length > 0"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import type { ChartData } from '@/types'
// Регистрация необходимых компонентов Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Пропсы компонента
const props = defineProps<ChartData>()

// Данные для графика
const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}))

// Настройки графика
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>
