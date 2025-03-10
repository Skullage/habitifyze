import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

interface Reminder {
  title: string
  body: string
  icon?: string
  time: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const permission = ref(Notification.permission) // Текущее состояние разрешения
  const reminders: Reminder[] = reactive([]) // Список напоминаний

  const requestPermission = async () => {
    if (permission.value !== 'granted') {
      permission.value = await Notification.requestPermission()
    }
  }

  const removePermission = () => {
    permission.value = 'default'
  }

  const showNotification = (title: string, options: NotificationOptions) => {
    if (permission.value === 'granted') {
      if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options)
        })
      }
    } else {
      console.warn('Разрешение на уведомления не получено.')
    }
  }

  const addReminder = (reminder: Reminder) => {
    reminders.push(reminder)
    scheduleReminder(reminder)
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const getCurrentTime = (): string => {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes()}`
  }

  const subtractTime = (targetTime: string) => {
    const targetMinutes = timeToMinutes(targetTime)
    const currentMinutes = timeToMinutes(getCurrentTime())

    // Вычитаем текущее время из целевого
    let diffMinutes = targetMinutes - currentMinutes

    // Если разница отрицательная, добавляем 24 часа (1440 минут)
    if (diffMinutes < 0) {
      diffMinutes += 1440 // 24 часа * 60 минут
    }

    // Преобразуем разницу обратно в часы и минуты
    return diffMinutes
  }

  const scheduleReminder = (reminder: Reminder) => {
    const { title, body, icon, time } = reminder
    const delay = subtractTime(time) * 60 * 1000
    if (delay > 0) {
      setTimeout(() => {
        console.log('Время вышло!')
        showNotification(title, { body, icon })
      }, delay)
    }
  }

  return { permission, reminders, requestPermission, addReminder, removePermission }
})
