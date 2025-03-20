import { ref } from 'vue'
import type { WeekDay } from '@/types'

const WEEK = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'] as const

export function useWeekDays() {
  const weekDays = ref<WeekDay[]>([])

  const getDayName = (dayIndex: number): string => {
    return WEEK[dayIndex % 7] as string
  }

  const initializeWeekDays = (): void => {
    const today = new Date()
    const currentDayOfWeek = today.getDay()
    const startOfWeek = new Date(today)

    startOfWeek.setDate(today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1))

    weekDays.value = Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date(startOfWeek)
      currentDate.setDate(startOfWeek.getDate() + i)

      return {
        date: currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' }),
        dayName: getDayName(currentDate.getDay()),
        fullDate: currentDate.toLocaleDateString(),
      }
    })
  }

  return {
    weekDays,
    initializeWeekDays,
  }
}
