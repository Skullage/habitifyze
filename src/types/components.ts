// HabitCard types
export interface HabitCardProps {
  title: string
  value: boolean[] | number[]
  target: number
  unit?: string
  isBooleanType?: boolean
}

export interface WeekDay {
  date: string
  dayName: string
  fullDate: string
}

export interface HabitHistoryData {
  title: string
  date: string
  goal?: number
}

export interface HabitCardEmits {
  (event: 'check', payload: { index: number; historyData: HabitHistoryData }): void
  (
    event: 'input',
    payload: { index: number; value: number; historyData: HabitHistoryData & { goal: number } },
  ): void
  (event: 'delete'): void
}

// ToggleSwitch types
export interface ToggleSwitchProps {
  modelValue: boolean
  label?: string
}

export interface ToggleSwitchEmits {
  'update:modelValue': [value: boolean]
}

// ProgressBar types
export interface ProgressBarProps {
  value?: number
  maxValue: number
}

export interface DataSet {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

// Chart types
export interface ChartData {
  labels: string[]
  datasets: DataSet[]
}
