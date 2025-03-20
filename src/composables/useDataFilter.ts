import { computed } from 'vue'
import type { DataSetPrerender, DataSet } from '@/types'

export const useDataFilter = (minDate: string, maxDate: string) => {
  const filterDataByDateRange = computed(() => (datasets: DataSetPrerender[]): DataSet[] => {
    // Создаем массив всех дат из всех наборов данных
    const allDates = datasets
      .flatMap((dataset) => dataset.data.map((item) => item.date))
      .filter((date, index, self) => self.indexOf(date) === index) // Убираем дубликаты
      .filter((date) => date >= minDate && date <= maxDate)
      .sort()

    return datasets.map((dataset) => {
      // Создаем массив значений для каждой даты
      const values = allDates.map((date) => {
        const item = dataset.data.find((d) => d.date === date)
        return item ? item.value : 0
      })

      return {
        label: dataset.label,
        data: values,
        backgroundColor: dataset.backgroundColor,
        borderColor: dataset.borderColor,
        borderWidth: dataset.borderWidth,
      }
    })
  })

  return {
    filterDataByDateRange: filterDataByDateRange.value,
  }
}
