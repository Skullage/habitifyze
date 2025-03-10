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
            <template v-for="(objects, date) in historyStore.history" :key="date">
              <li v-for="(obj, index) in objects" :key="index">
                <p v-if="obj.goal">
                  {{ `${date} - ${obj.name} - Выполнено ${obj.sum}/${obj.goal}` }}
                </p>
                <p v-else>
                  {{ `${date} - ${obj.name} - ${obj.completed ? 'Выполнено' : 'Не выполнено'}` }}
                </p>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>
