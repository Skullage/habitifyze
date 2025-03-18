import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getRandomColor } from '@/utils/color'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

interface HabitEntry {
  name: string
  completed: boolean
  value: number | boolean
  goal?: number
  sum?: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

export interface DataSetPrerender {
  label: string
  data: { value: number; date: string }[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

interface HabitHistory {
  [date: string]: HabitEntry[]
}

export const useHistoryStore = defineStore('history', () => {
  const history = reactive<HabitHistory>({})

  // Получение всех дат
  const getDates = (): string[] => {
    return Object.keys(history)
  }

  const getOrderedHistory = (): HabitHistory => {
    const ordered = Object.keys(history)
      .sort()
      .reduce((obj: HabitHistory, key: string) => {
        obj[key] = history[key]
        return obj
      }, {})
    return ordered
  }

  const getPercentCompletedDataset = () => {
    const color = getRandomColor()
    const percent = 90
    return [
      {
        data: [percent, 100 - percent],
        backgroundColor: [color, 'gray'], // Уникальный цвет для каждого label
        borderColor: [color, 'gray'], // Уникальный цвет для каждого label,
      },
    ]
  }

  // Получение данных для Chart.js
  const getDataset = (): DataSetPrerender[] => {
    const groupedData = Object.entries(getOrderedHistory())
      .flatMap(([date, items]) =>
        items
          .filter((item) => item.goal) // Фильтруем только числовые значения
          .map((item) => ({
            ...item,
            date, // Добавляем дату из ключа объекта history
          })),
      )
      .filter((el) => el.goal) // Фильтруем только числовые значения
      .reduce(
        (acc, item) => {
          // Если label уже существует в аккумуляторе, добавляем completed в массив data
          if (acc[item.name]) {
            acc[item.name].data.push({
              value: item.sum as number,
              date: item.date.split('.').reverse().join('-'), // Используем дату из ключа
            })
          } else {
            // Если label не существует, создаем новую запись
            acc[item.name] = {
              label: item.name,
              data: [{ value: item.sum as number, date: item.date.split('.').reverse().join('-') }],
              backgroundColor: item.backgroundColor, // Уникальный цвет для каждого label
              borderColor: item.borderColor, // Уникальный цвет для границы
              borderWidth: 1,
            }
          }
          return acc
        },
        {} as Record<string, DataSetPrerender>,
      )
    // Преобразуем объект groupedData в массив
    return Object.values(groupedData)
  }

  const loadHistory = () => {
    const storedHistory = loadFromStorage<History[]>('history')
    if (storedHistory) {
      Object.assign(history, storedHistory)
    }
  }
  const updateValue = (
    value: number | boolean,
    historyData: { title: string; goal?: number; date: string },
    sum?: number,
  ) => {
    const { date, title, goal } = historyData
    const entries = history[date] || []
    const existingEntry = entries.find((el) => el.name === title)
    if (existingEntry) {
      handleExistingEntry(existingEntry, value, sum)
      if (typeof value === 'boolean' && !value) {
        removeEntry(date, title)
      }
    } else {
      addNewEntry(date, title, value, goal, sum)
    }
    saveToStorage('history', history)
  }

  const handleExistingEntry = (entry: HabitEntry, value: number | boolean, sum?: number) => {
    entry.value = value
    entry.sum = sum
    entry.completed =
      (typeof value === 'boolean' && value) ||
      (typeof value === 'number' && (sum as number) >= (entry.goal as number))
  }

  const removeEntry = (date: string, title: string) => {
    const entries = history[date]
    const index = entries.findIndex((el) => el.name === title)
    if (index !== -1) {
      entries.splice(index, 1)
      if (entries.length === 0) {
        delete history[date]
      }
    }
  }

  const addNewEntry = (
    date: string,
    title: string,
    value: number | boolean,
    goal?: number,
    sum?: number,
  ) => {
    const color = getRandomColor()
    const newEntry: HabitEntry = {
      name: title,
      goal,
      completed:
        (typeof value === 'boolean' && value) ||
        (typeof value === 'number' && (sum as number) >= (goal as number)),
      value,
      sum,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
    }

    if (!history[date]) history[date] = []
    history[date].push(newEntry)
  }

  return {
    history,
    updateValue,
    getDates,
    getDataset,
    loadHistory,
    getOrderedHistory,
    getPercentCompletedDataset,
  }
})
