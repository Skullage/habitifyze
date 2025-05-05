import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StatsView from '@/views/StatsView.vue'
import HabitStatsView from '@/views/HabitStatsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/habit/:name',
      name: 'habit-stats',
      component: HabitStatsView,
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

export default router
