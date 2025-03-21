<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { MENU_ITEMS } from '@/constants'

const historyStore = useHistoryStore()
const isMenuOpen = ref<boolean>(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(() => {
  historyStore.loadHistory()
})
</script>
<template>
  <div class="app-wrapper flex flex-col w-full min-h-screen overflow-x-hidden relative">
    <header class="bg-accent-light py-4 fixed top-0 left-0 w-full z-50">
      <div class="container flex items-center justify-between">
        <!-- Десктопное меню -->
        <nav class="hidden md:block w-full">
          <ul class="flex items-center justify-center gap-8 uppercase">
            <li
              class="flex gap-2 items-center hover:scale-105 duration-200"
              v-for="(item, index) in MENU_ITEMS"
              :key="index"
            >
              <RouterLink :to="item.link" class="order-1">{{ item.title }}</RouterLink>
              <Icon :icon="item.icon" class="icon" />
            </li>
          </ul>
        </nav>

        <!-- Кнопка бургера для мобильных устройств -->
        <button class="md:hidden block ml-auto z-60" @click="toggleMenu">
          <Icon
            v-if="!isMenuOpen"
            icon="mdi:menu"
            class="w-8 h-8 transition-transform duration-200"
          />
          <Icon v-else icon="mdi:close" class="w-8 h-8 transition-transform duration-200" />
        </button>

        <!-- Мобильное меню с анимацией -->
        <Transition name="slide">
          <nav
            v-if="isMenuOpen"
            class="md:hidden fixed top-0 left-0 w-full h-full bg-accent-light z-40"
          >
            <ul class="flex flex-col justify-center items-center uppercase gap-8 h-full">
              <li
                class="flex gap-2 items-center hover:scale-105 duration-200"
                v-for="(item, index) in MENU_ITEMS"
                :key="index"
                @click="toggleMenu"
              >
                <RouterLink :to="item.link" class="order-1">{{ item.title }}</RouterLink>
                <Icon :icon="item.icon" class="icon" />
              </li>
            </ul>
          </nav>
        </Transition>
      </div>
    </header>
    <RouterView class="pt-20 flex-1 pb-4" />
  </div>
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
