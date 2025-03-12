<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted } from 'vue'
import { useHistoryStore } from '@/stores/history.ts'

interface menuLink {
  title: string
  link: string
  icon: string
}

const historyStore = useHistoryStore()

const menu = <menuLink[]>[
  { title: 'Главная', link: '/', icon: 'material-symbols:house-rounded' },
  { title: 'Статистика', link: '/stats', icon: 'material-symbols:query-stats-rounded' },
  { title: 'Настройки', link: '/settings', icon: 'material-symbols:settings' },
]

onMounted(() => {
  historyStore.loadHistory()
})
</script>
<template>
  <header class="bg-accent-light py-4 sticky top-0 left-0 w-full">
    <div class="container">
      <nav>
        <ul class="flex justify-center uppercase gap-8">
          <li
            class="flex gap-2 items-center hover:scale-105 duration-200"
            v-for="(item, index) in menu"
            :key="index"
          >
            <RouterLink :to="item.link" class="order-1">{{ item.title }}</RouterLink>
            <Icon :icon="item.icon" class="icon" />
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
<style>
.router-link-active,
.router-link-active ~ .icon {
  color: white;
  font-weight: bold;
}
.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
