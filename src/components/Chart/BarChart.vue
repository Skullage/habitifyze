<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Регистрация необходимых компонентов Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Интерфейсы для типизации данных
export interface DataSet {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

interface ChartData {
  labels: string[]
  datasets: DataSet[]
}

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
