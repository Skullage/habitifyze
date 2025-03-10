<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useNotificationsStore } from '@/stores/notifications'

const notificationStore = useNotificationsStore()
const notificationsTime = ref('00:00')

const requestPermission = () => {
  notificationStore.requestPermission()
}

const reset = () => {
  localStorage.removeItem('habits')
  localStorage.removeItem('history')
}

const saveToStorage = () => {
  addReminders()
  localStorage.setItem('notificationsTime', notificationsTime.value)
}

const addReminders = () => {
  notificationStore.addReminder({
    title: 'HabitTracker',
    body: 'Не забудьте выполнить свои привычки',
    time: notificationsTime.value,
  })
}

onMounted(() => {
  const notificationsTimeValue = localStorage.getItem('notificationsTime')
  if (notificationsTimeValue) {
    notificationsTime.value = notificationsTimeValue
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
              @change="saveToStorage"
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
