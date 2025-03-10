import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { DataSet } from '@/components/Chart/BarChart.vue'

interface HabitHistory {
  [date: string]: {
    name: string
    completed: boolean
    value: number | boolean
    goal?: number
    sum?: number
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }[]
}

export const useHistoryStore = defineStore('history', () => {
  const history = reactive<HabitHistory>({})

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  const getDates = (): string[] => {
    return Object.keys(history)
  }

  const getDataset = (): DataSet[] => {
    const groupedData = Object.values(history)
      .flatMap((entries) => entries) // Преобразуем объект в массив записей
      .filter((el) => el.goal) // Фильтруем только числовые значения
      .reduce(
        (acc, item) => {
          // Если label уже существует в аккумуляторе, добавляем completed в массив data
          if (acc[item.name]) {
            acc[item.name].data.push(item.sum as number)
          } else {
            // Если label не существует, создаем новую запись
            acc[item.name] = {
              label: item.name,
              data: [item.sum as number],
              backgroundColor: item.backgroundColor, // Уникальный цвет для каждого label
              borderColor: item.borderColor, // Уникальный цвет для границы
              borderWidth: 1,
            }
          }
          return acc
        },
        {} as Record<string, DataSet>,
      )
    // Преобразуем объект groupedData в массив
    return Object.values(groupedData)
  }
  const saveToStorage = () => {
    localStorage.setItem('history', JSON.stringify(history))
  }
  const loadFromStorage = () => {
    const storedHistory = localStorage.getItem('history')
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory)
        Object.assign(history, parsedHistory) // Восстанавливаем состояние history
      } catch (error) {
        console.error('Ошибка при загрузке данных из localStorage:', error)
      }
    }
  }
  const updateValue = (
    value: number | boolean,
    historyData: { title: string; goal?: number; date: string },
    sum?: number,
  ) => {
    const array = history[historyData.date]
      ? history[historyData.date].find((el) => el.name === historyData.title)
      : null
    if (array) {
      if (typeof value === 'boolean' && !value) {
        const index = history[historyData.date].findIndex((el) => el.name === historyData.title)
        if (index !== -1) {
          // Удаляем элемент из массива
          history[historyData.date].splice(index, 1)

          // Если массив пуст, удаляем объект с этой датой
          if (history[historyData.date].length === 0) {
            delete history[historyData.date]
          }
        }
      } else {
        array.value = value
        array.sum = sum
        array.completed =
          (typeof value === 'boolean' && value) ||
          (typeof value === 'number' && (sum as number) >= (array.goal as number))
      }
    } else {
      if (!history[historyData.date]) history[historyData.date] = []
      const color = getRandomColor()
      history[historyData.date].push({
        name: historyData.title,
        goal: historyData.goal ? historyData.goal : undefined,
        completed:
          (typeof value === 'boolean' && value) ||
          (typeof value === 'number' && (sum as number) >= (historyData.goal as number)),
        value: value,
        sum: sum ? sum : undefined,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      })
    }
    saveToStorage()
  }

  return { history, updateValue, getDates, getDataset, loadFromStorage }
})
