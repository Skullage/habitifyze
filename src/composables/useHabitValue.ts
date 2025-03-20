import { computed } from 'vue'
import type { HabitCardProps, HabitHistoryData } from '@/types'

export function useHabitValue(props: HabitCardProps) {
  const getValue = computed((): number => {
    if (props.isBooleanType) {
      return props.value.filter((value): value is boolean => typeof value === 'boolean' && value)
        .length
    }

    return (props.value as number[]).reduce((sum, current) => sum + current, 0)
  })

  const getProgress = computed((): number => {
    const value = getValue.value
    return Math.min(value, props.target)
  })

  const createHistoryData = (date: string): HabitHistoryData & { goal: number } => {
    const baseData = {
      title: props.title,
      date,
      goal: props.target,
    }

    return baseData
  }

  return {
    getValue,
    getProgress,
    createHistoryData,
  }
}
