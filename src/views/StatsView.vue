<script setup lang="ts">
import BarChart from '@/components/Chart/BarChart.vue'
import { useHistoryStore } from '@/stores/history.ts'
const historyStore = useHistoryStore()
</script>
<template>
  <main class="h-full flex flex-col justify-center">
    <div class="container">
      <div>
        <div class="pb-4 mb-8">
          <h1 class="text-center text-3xl font-bold">Ваш прогресс</h1>
        </div>
        <div>
          <BarChart :labels="historyStore.getDates()" :datasets="historyStore.getDataset()" />
        </div>
        <div>
          <h2>История:</h2>
          <ul>
            <li v-for="(item, index) in Object.entries(historyStore.history)" :key="index">
              {{
                `${item[0]} - ${item[1][0].name} - Выполнено ${item[1][0].completed}/${item[1][0].goal}`
              }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>
