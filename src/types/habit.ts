export interface Habit {
  title: string
  done: boolean[] | number[]
  target: number
  unit: string
  isBooleanType: boolean
}

export interface Validate {
  habit: string | null
  target: string | null
  unit: string | null
}
