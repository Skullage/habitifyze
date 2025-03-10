import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker зарегистрирован:', registration)
    })
    .catch((error) => {
      console.log('Ошибка регистрации Service Worker:', error)
    })
}

app.mount('#app')
