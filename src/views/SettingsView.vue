<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useNotificationsStore } from '@/stores/notifications'
import { saveToStorage, loadFromStorage } from '@/utils/storage'

const notificationStore = useNotificationsStore()
const notificationsTime = ref<string>('00:00')

const requestPermission = () => {
  notificationStore.requestPermission()
}

const reset = () => {
  localStorage.removeItem('habits')
  localStorage.removeItem('history')
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
  <main class="h-full flex flex-col justify-center">
    <div class="container">
      <div>
        <div class="pb-4 mb-8">
          <h1 class="text-center text-3xl font-bold">Настройки</h1>
        </div>
        <div class="text-center">
          <div class="flex justify-center items-center gap-4 mb-4">
            <p>Уведомления:</p>
            <input
              type="time"
              class="border p-1 rounded cursor-pointer"
              v-model="notificationsTime"
              @change="changeNotificationsTime"
            />
          </div>
          <div class="flex gap-2 justify-center items-center">
            <button
              @click="requestPermission"
              v-if="notificationStore.permission !== 'granted'"
              class="border px-2 py-4 rounded hover:bg-green-500 cursor-pointer duration-300 hover:border-green-500"
            >
              Включить Уведомления
            </button>
            <button
              @click="reset"
              class="border px-2 py-4 rounded hover:bg-green-500 cursor-pointer duration-300 hover:border-green-500"
            >
              Сбросить прогресс
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
