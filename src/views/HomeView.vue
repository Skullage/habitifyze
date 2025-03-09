<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import HabitCard from '@/components/HabitCard.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useHistoryStore } from '@/stores/history.ts'

interface Habit {
  title: string
  done: boolean[] | number[] | null[]
  target: number
  unit: string
  isBooleanType: boolean
}

interface Validate {
  habit: string | null
  target: string | null
  unit: string | null
}

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

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max)
}

const habitExample: string[] = [
  'Пить 2 литра воды',
  'Читать 30 минут',
  'Заниматься спортом 5 дней',
  'Сделать 10 000 шагов',
  'Съесть 5 порций овощей/фруктов',
  'Изучать английский язык 15 минут',
]

const saveToStorage = () => {
  localStorage.setItem('habits', JSON.stringify(habits))
}

const loadFromStorage = () => {
  const storedHabits = localStorage.getItem('habits')
  if (storedHabits) {
    habits.splice(0, habits.length, ...JSON.parse(storedHabits))
  } else {
    habits.splice(0, habits.length) // Очищаем массив, если в хранилище ничего нет
  }
}

const addHabit = () => {
  if (!habit.value.trim()) return (validate.value.habit = 'Введите привычку')
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
  if (isBooleanType.value) {
    habits.push({
      title: habit.value,
      done: [false, false, false, false, false, false, false],
      target: 7,
      unit: 'дней',
      isBooleanType: true,
    })
  } else {
    habits.push({
      title: habit.value,
      done: [null, null, null, null, null, null, null],
      target: Number(target.value),
      unit: unit.value,
      isBooleanType: false,
    })
  }

  habit.value = ''
  target.value = null
  unit.value = ''
  validate.value.habit = null
  validate.value.target = null
  validate.value.unit = null
  saveToStorage()
}

const deleteHabit = (index: number) => {
  habits.splice(index, 1)
  saveToStorage()
}

const checkDay = (index: number, day: number, historyData: { title: string; date: string }) => {
  habits[index].done[day] = !habits[index].done[day]
  historyStore.updateValue(habits[index].done[day], historyData)
  saveToStorage()
}

const writeDayValue = (
  index: number,
  value: number,
  day: number,
  historyData: { title: string; goal: number; date: string },
) => {
  if (!isNaN(value)) {
    habits[index].done[day] = value
    const sum = (habits[index].done as number[]).reduce((prev, current) => (prev += current))
    historyStore.updateValue(value, historyData, sum)
    saveToStorage()
  }
}

const getRandomHabitExample = computed((): string => {
  return habitExample[getRandomInt(habitExample.length - 1)]
})

onMounted(() => {
  loadFromStorage()
})
</script>

<template>
  <main class="h-full flex flex-col justify-center">
    <div class="container">
      <div class="grid justify-center">
        <div class="pb-4 mb-8">
          <h1 class="text-center text-3xl font-bold">HabitTracker</h1>
          <p class="text-md">Отслеживайте свои привычки и достигайте целей с легкостью!</p>
        </div>
        <div class="flex justify-between">
          Измеримая
          <ToggleSwitch v-model="isBooleanType" />
          Да/Нет
        </div>
        <Transition name="fade" mode="out-in">
          <form
            class="flex flex-col mb-8 shadow-lg p-8"
            key="boolean-form"
            @submit.prevent="addHabit"
            v-if="isBooleanType"
          >
            <label class="flex flex-col mb-4">
              Введите привычку
              <input
                type="text"
                class="w-full border-b outline-none"
                :class="{ error: validate.habit }"
                :placeholder="getRandomHabitExample"
                v-model="habit"
              />
              <span
                class="text-sm h-4"
                :style="{ visibility: validate.habit ? 'visible' : 'hidden' }"
                >{{ validate.habit }}</span
              >
            </label>
            <button
              type="submit"
              class="rounded-lg py-2 cursor-pointer bg-green-500 hover:scale-[103%] duration-300"
            >
              Добавить
            </button>
          </form>
          <form
            class="flex flex-col mb-8 shadow-lg p-8"
            @submit.prevent="addHabit"
            key="measurable-form"
            v-else
          >
            <label class="flex flex-col mb-4">
              Введите привычку
              <input
                type="text"
                class="w-full border-b outline-none"
                :class="{ error: validate.habit }"
                :placeholder="getRandomHabitExample"
                v-model="habit"
              />
              <span
                class="text-sm h-4"
                :style="{ visibility: validate.habit ? 'visible' : 'hidden' }"
                >{{ validate.habit }}</span
              >
            </label>
            <div class="flex gap-4">
              <label class="flex flex-col mb-4 flex-1">
                Цель
                <input
                  type="text"
                  class="w-full border-b outline-none"
                  :class="{ error: validate.target }"
                  placeholder="15"
                  v-model="target"
                />
                <span
                  class="text-sm h-4"
                  :style="{ visibility: validate.target ? 'visible' : 'hidden' }"
                  >{{ validate.target }}</span
                >
              </label>
              <label class="flex flex-col mb-4 w-[8ch]">
                Ед. изм.
                <input
                  type="text"
                  class="w-full border-b outline-none"
                  :class="{ error: validate.unit }"
                  placeholder="км"
                  v-model="unit"
                />
                <span
                  class="text-sm h-4"
                  :style="{ visibility: validate.unit ? 'visible' : 'hidden' }"
                  >{{ validate.unit }}</span
                >
              </label>
            </div>

            <button
              type="submit"
              class="rounded-lg py-2 cursor-pointer bg-green-500 hover:scale-[103%] duration-300"
            >
              Добавить
            </button>
          </form>
        </Transition>
      </div>
      <transition-group
        name="list"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
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
    </div>
  </main>
</template>
<style scoped>
.error {
  border-color: red;
}
.error ~ span {
  color: red;
}
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

/* Анимация для переключения форм */
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
