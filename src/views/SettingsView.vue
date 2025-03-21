<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import { saveToStorage, loadFromStorage } from '@/utils/storage'
import { useHistoryStore } from '@/stores/history'

const notificationStore = useNotificationsStore()
const historyStore = useHistoryStore()
const notificationsTime = ref<string>('00:00')
const router = useRouter()

const requestPermission = () => {
  notificationStore.requestPermission()
}

const reset = () => {
  localStorage.removeItem('habits')
  localStorage.removeItem('history')
  historyStore.resetHistory()
  router.push('/')
}

const changeNotificationsTime = () => {
  addReminders()
  saveToStorage('notificationsTime', notificationsTime.value)
}

const addReminders = () => {
  notificationStore.stopReminderChecker()
  notificationStore.addReminder({
    title: 'HabitTracker',
    body: 'Не забудьте выполнить свои привычки',
    time: notificationsTime.value,
  })
}

onMounted(() => {
  const storedTime = loadFromStorage<string>('notificationsTime')
  if (storedTime) {
    notificationsTime.value = storedTime
    notificationStore.addReminder({
      title: 'HabitTracker',
      body: 'Не забудьте выполнить свои привычки',
      time: notificationsTime.value,
    })
  }
})
</script>
<template>
  <main class="h-full bg-gray-50">
    <div class="container py-8">
      <div class="max-w-2xl mx-auto">
        <div class="pb-4 mb-8">
          <h1 class="text-center text-4xl font-bold text-gray-800 mb-2">Настройки</h1>
          <p class="text-center text-gray-600">Управляйте приложением и настройте уведомления</p>
        </div>

        <div class="space-y-6">
          <!-- Секция уведомлений -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Уведомления</h2>
            <div class="space-y-4">
              <div class="flex flex-col items-center gap-2">
                <label class="text-sm text-gray-600">Время напоминания</label>
                <input
                  type="time"
                  v-model="notificationsTime"
                  @change="changeNotificationsTime"
                  class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                />
              </div>

              <div class="flex justify-center">
                <button
                  @click="requestPermission"
                  v-if="notificationStore.permission !== 'granted'"
                  class="cursor-pointer px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                    />
                  </svg>
                  Включить уведомления
                </button>
              </div>
            </div>
          </div>

          <!-- Секция сброса данных -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Управление данными</h2>
            <div class="space-y-4">
              <p class="text-gray-600 text-center">
                Сбросить все данные и начать заново? Это действие нельзя отменить.
              </p>
              <div class="flex justify-center">
                <button
                  @click="reset"
                  class="cursor-pointer px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Сбросить прогресс
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
