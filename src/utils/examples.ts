import { getRandomInt } from '@/utils/numbers'
import { computed } from 'vue'

const habitExample: string[] = [
  'Пить 2 литра воды',
  'Читать 30 минут',
  'Заниматься спортом 5 дней',
  'Сделать 10 000 шагов',
  'Съесть 5 порций овощей/фруктов',
  'Изучать английский язык 15 минут',
]

export const getRandomHabitExample = computed((): string => {
  return habitExample[getRandomInt(habitExample.length - 1)]
})
