<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import HabitCard from '@/components/HabitCard.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useHistoryStore } from '@/stores/history.ts'
import type { Habit, Validate } from '@/types'

import { saveToStorage, loadFromStorage } from '@/utils/storage'
import { getRandomHabitExample } from '@/utils/examples'
import { useDateFormatter } from '@/composables/useDateFormatter'

const { getMonday } = useDateFormatter()

const validate = ref<Validate>({
  habit: null,
  target: null,
  unit: null,
})

const isBooleanType = ref<boolean>(true)

const habit = ref<string>('')
const unit = ref<string>('')
const target = ref<number | null>()
const historyStore = useHistoryStore()

const habits = reactive<Habit[]>([])

const addHabit = (): void | string => {
  if (!habit.value.trim()) return (validate.value.habit = 'Введите привычку')

  // Проверка на уникальность названия
  const isDuplicate = habits.some((h) => h.title.toLowerCase() === habit.value.trim().toLowerCase())
  if (isDuplicate) return (validate.value.habit = 'Привычка с таким названием уже существует')

  if (!isBooleanType.value) {
    if (!target.value || isNaN(target.value)) {
      validate.value.target = 'Введите корректное число'
      return
    }
    if (!unit.value.trim()) {
      validate.value.unit = 'Введите единицу измерения'
      return
    }
  }
  const newHabit: Habit = {
    title: habit.value,
    done: isBooleanType.value ? Array(7).fill(false) : Array(7).fill(0),
    target: isBooleanType.value ? 7 : Number(target.value),
    unit: isBooleanType.value ? 'дней' : unit.value,
    isBooleanType: isBooleanType.value,
    weekId: getMonday(new Date()),
  }

  habits.push(newHabit)

  resetForm()
  saveToStorage('habits', habits)
}

const resetForm = () => {
  habit.value = ''
  target.value = null
  unit.value = ''
  validate.value = { habit: null, target: null, unit: null }
}

const deleteHabit = (index: number) => {
  if (!habits[index]?.title) return
  const habitTitle = habits[index].title
  habits.splice(index, 1)
  saveToStorage('habits', habits)

  // Удаляем историю привычки
  Object.keys(historyStore.history).forEach((date) => {
    historyStore.removeEntry(date, habitTitle)
  })
}

const checkDay = (index: number, day: number, historyData: { title: string; date: string }) => {
  if (!habits[index]?.done) return
  habits[index].done[day] = !habits[index].done[day]
  historyStore.updateValue(habits[index].done[day], historyData)
  saveToStorage('habits', habits)
}

const writeDayValue = (
  index: number,
  value: number,
  day: number,
  historyData: { title: string; goal: number; date: string },
) => {
  if (!isNaN(value) && habits[index]?.done) {
    habits[index].done[day] = value
    const sum = (habits[index].done as number[]).reduce((acc, current) => (acc += current), 0)
    historyStore.updateValue(value, historyData, sum)
    saveToStorage('habits', habits)
  }
}

const loadHabits = () => {
  const storedHabits = loadFromStorage<Habit[]>('habits')
  if (storedHabits) {
    habits.splice(0, habits.length, ...storedHabits)
    if (habits[0]?.weekId !== getMonday(new Date())) {
      clearHabitsValue()
    }
  } else {
    habits.splice(0, habits.length)
  }
}

const clearHabitsValue = () => {
  habits.forEach((habit) => {
    habit.done = habit.isBooleanType ? Array(7).fill(false) : Array(7).fill(0)
    habit.weekId = getMonday(new Date())
    // Обновляем историю для каждого дня недели
    for (let day = 0; day < 7; day++) {
      const date = new Date(habit.weekId)
      date.setDate(date.getDate() + day)
      historyStore.updateValue(habit.isBooleanType ? false : 0, {
        title: habit.title,
        date: date.toISOString().split('T')[0] as string,
      })
    }
  })
  saveToStorage('habits', habits)
}

onMounted(() => {
  loadHabits()
})
</script>

<template>
  <main class="h-full bg-gray-50">
    <div class="container py-8">
      <div class="max-w-4xl mx-auto">
        <div class="pb-4 mb-8">
          <h1 class="text-center text-4xl font-bold text-gray-800 mb-2">Habitifyze</h1>
          <p class="text-center text-gray-600">
            Отслеживайте свои привычки и достигайте целей с легкостью!
          </p>
        </div>

        <div class="space-y-8">
          <!-- Форма добавления привычки -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <span class="text-gray-700">Измеримая</span>
              <ToggleSwitch v-model="isBooleanType" />
              <span class="text-gray-700">Да/Нет</span>
            </div>

            <Transition name="fade" mode="out-in">
              <form
                class="space-y-4"
                @submit.prevent="addHabit"
                :key="isBooleanType ? 'boolean-form' : 'measurable-form'"
              >
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"> Введите привычку </label>
                  <input
                    type="text"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    :class="{ 'border-red-500': validate.habit }"
                    :placeholder="getRandomHabitExample"
                    v-model="habit"
                  />
                  <span v-if="validate.habit" class="text-sm text-red-500">{{
                    validate.habit
                  }}</span>
                </div>

                <template v-if="!isBooleanType">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700"> Цель </label>
                      <input
                        type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        :class="{ 'border-red-500': validate.target }"
                        placeholder="15"
                        v-model="target"
                      />
                      <span v-if="validate.target" class="text-sm text-red-500">{{
                        validate.target
                      }}</span>
                    </div>

                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700"> Ед. изм. </label>
                      <input
                        type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        :class="{ 'border-red-500': validate.unit }"
                        placeholder="км"
                        v-model="unit"
                      />
                      <span v-if="validate.unit" class="text-sm text-red-500">{{
                        validate.unit
                      }}</span>
                    </div>
                  </div>
                </template>

                <button
                  type="submit"
                  class="cursor-pointer w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Добавить привычку
                </button>
              </form>
            </Transition>
          </div>

          <!-- Список привычек -->
          <transition-group
            name="list"
            tag="div"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <habit-card
              v-for="(item, index) in habits"
              :title="item.title"
              :value="item.done"
              :target="item.target"
              :unit="item.unit"
              :isBooleanType="item.isBooleanType"
              @input="writeDayValue(index, $event.value, $event.index, $event.historyData)"
              :key="index"
              @check="checkDay(index, $event.index, $event.historyData)"
              @delete="deleteHabit(index)"
            />
          </transition-group>

          <!-- Состояние "нет привычек" -->
          <div v-if="habits.length === 0" class="text-center py-12">
            <div class="bg-white rounded-lg shadow-md p-8">
              <p class="text-xl text-gray-600">У вас пока нет привычек</p>
              <p class="text-sm text-gray-500 mt-2">
                Добавьте свою первую привычку, чтобы начать отслеживать прогресс
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
