export interface HabitEntry {
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

export interface HabitHistory {
  [date: string]: HabitEntry[]
}

export interface HistoryData {
  title: string
  goal?: number
  date: string
}
