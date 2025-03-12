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
  let intervalId: number | null = null // ID интервала для проверки напоминаний

  const requestPermission = async () => {
    if (permission.value !== 'granted') {
      permission.value = await Notification.requestPermission()
    }
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
    startReminderChecker()
  }

  const checkReminders = () => {
    const currentTime = getCurrentTime()
    const currentMinutes = timeToMinutes(currentTime)

    reminders.forEach((reminder, index) => {
      const reminderMinutes = timeToMinutes(reminder.time)

      // Если текущее время совпадает с временем напоминания
      if (currentMinutes === reminderMinutes) {
        showNotification(reminder.title, {
          body: reminder.body,
          icon: reminder.icon,
        })
      }
    })
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const getCurrentTime = (): string => {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes()}`
  }

  // Запускаем проверку напоминаний
  const startReminderChecker = () => {
    if (intervalId === null) {
      // Запускаем интервал с проверкой каждую минуту
      intervalId = setInterval(checkReminders, 60 * 1000) // 60 секунд * 1000 мс
    }
  }

  // Очищаем интервал при уничтожении хранилища (опционально)
  const stopReminderChecker = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  return { permission, reminders, requestPermission, addReminder, stopReminderChecker }
})
