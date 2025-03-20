import { HABIT_EXAMPLES } from '@/constants'
import { getRandomInt } from '@/utils/numbers'
import { computed } from 'vue'

export const getRandomHabitExample = computed((): string => {
  return HABIT_EXAMPLES[getRandomInt(HABIT_EXAMPLES.length - 1)] as string
})
