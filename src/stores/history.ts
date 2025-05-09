import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getRandomColor } from '@/utils/color'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import type { HabitEntry, DataSetPrerender, HabitHistory, HistoryData } from '@/types'

export const useHistoryStore = defineStore('history', () => {
  const history = reactive<HabitHistory>({})

  const resetHistory = (): void => {
    Object.keys(history).forEach((key) => delete history[key])
  }

  const getOrderedHistory = (): HabitHistory => {
    const ordered = Object.keys(history)
      .sort()
      .reduce((obj: HabitHistory, key: string) => {
        obj[key] = history[key] || []
        return obj
      }, {})
    return ordered
  }

  // Получение данных для Chart.js
  const getDataset = (): DataSetPrerender[] => {
    const groupedData = Object.entries(getOrderedHistory())
      .flatMap(([date, items]) =>
        items
          .filter((item): item is HabitEntry & { goal: number } => Boolean(item.goal))
          .map((item) => ({
            ...item,
            date,
          })),
      )
      .reduce(
        (acc, item) => {
          if (acc[item.name]) {
            acc[item.name]!.data.push({
              value: item.value as number,
              date: item.date.split('.').reverse().join('-'),
            })
          } else {
            acc[item.name] = {
              label: item.name,
              data: [
                { value: item.value as number, date: item.date.split('.').reverse().join('-') },
              ],
              backgroundColor: item.backgroundColor,
              borderColor: item.borderColor,
              borderWidth: 1,
            }
          }
          return acc
        },
        {} as Record<string, DataSetPrerender>,
      )
    return Object.values(groupedData)
  }

  const loadHistory = (): void => {
    const storedHistory = loadFromStorage<HabitHistory>('history')
    if (storedHistory) {
      Object.assign(history, storedHistory)
    }
  }

  const updateValue = (value: number | boolean, historyData: HistoryData, sum?: number): void => {
    const { date, title, goal } = historyData
    const entries = history[date] || []
    const existingEntry = entries.find((el) => el.name === title)
    if (existingEntry) {
      handleExistingEntry(existingEntry, value, sum)
      // if ((typeof value === 'boolean' && !value) || (typeof value === 'number' && value <= 0)) {
      //   removeEntry(date, title)
      // }
    } else {
      addNewEntry(date, title, value, goal, sum)
    }
    saveToStorage('history', history)
  }

  const handleExistingEntry = (entry: HabitEntry, value: number | boolean, sum?: number): void => {
    entry.value = value
    entry.sum = sum
    entry.completed =
      (typeof value === 'boolean' && value) ||
      (typeof value === 'number' && (sum as number) >= (entry.goal as number))
  }

  const removeEntry = (date: string, title: string): void => {
    const entries = history[date]
    if (!entries) return

    const index = entries.findIndex((el) => el.name === title)
    if (index !== -1) {
      entries.splice(index, 1)
      if (entries.length === 0) {
        delete history[date]
      }
    }
    saveToStorage('history', history)
  }

  const addNewEntry = (
    date: string,
    title: string,
    value: number | boolean,
    goal?: number,
    sum?: number,
  ): void => {
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

  const filteredHistoryByDate = (minDate: string, maxDate: string) => {
    const filtered: HabitHistory = {}

    Object.entries(getOrderedHistory()).forEach(([date, items]) => {
      const formattedDate = date.split('.').reverse().join('-')
      if (formattedDate >= minDate && formattedDate <= maxDate) {
        filtered[date] = items
      }
    })
    return filtered
  }

  return {
    history,
    updateValue,
    getDataset,
    loadHistory,
    resetHistory,
    removeEntry,
    filteredHistoryByDate,
  }
})
