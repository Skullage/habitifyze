export interface Habit {
  title: string
  done: boolean[] | number[]
  target: number
  unit: string
  isBooleanType: boolean
  weekId: string
}

export interface Validate {
  habit: string | null
  target: string | null
  unit: string | null
}
