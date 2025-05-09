import { computed } from 'vue'

export const useDateFormatter = () => {
  const formatDateToISO = (date: string): string => {
    const [day, month, year] = date.split('.')
    return `${year}-${month!.padStart(2, '0')}-${day!.padStart(2, '0')}`
  }

  const getCurrentDate = computed((): string => {
    return new Date().toISOString().split('T')[0] as string
  })

  const getMonday = (d: Date): string => {
    d = new Date(d)
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1) // adjust when day is sunday
    return new Date(d.setDate(diff)).toISOString().split('T')[0] as string
  }

  const formatDateToDisplay = (date: string): string => {
    const [year, month, day] = date.split('-')
    return `${day}.${month}.${year}`
  }

  return {
    formatDateToISO,
    getCurrentDate,
    formatDateToDisplay,
    getMonday,
  }
}
