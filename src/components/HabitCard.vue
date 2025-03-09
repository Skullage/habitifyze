<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import ProgressBar from '@/components/ProgressBar.vue'

interface WeekDay {
  date: string
  dayName: string
  fullDate: string
}

const weekDays = ref<WeekDay[]>([])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Array as () => boolean[] | number[],
    default: () => [],
  },
  target: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
  },
  isBooleanType: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits<{
  (
    event: 'check',
    payload: {
      index: number
      historyData: {
        title: string
        date: string
      }
    },
  ): void
  (
    event: 'input',
    payload: {
      index: number
      value: number
      historyData: {
        title: string
        goal: number
        date: string
      }
    },
  ): void
  (event: 'delete'): void
}>()

// Функция для получения названия дня недели
const getDayName = (dayIndex: number): string => {
  const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
  return days[dayIndex]
}

// Функция для получения дней текущей недели
const getWeekDays = () => {
  const today = new Date() // Текущая дата
  const currentDayOfWeek = today.getDay() // День недели (0 - воскресенье, 1 - понедельник и т.д.)
  const startOfWeek = new Date(today) // Начало недели

  // Переходим на понедельник (если сегодня не понедельник)
  startOfWeek.setDate(today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1))

  // Заполняем массив днями недели
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + i)

    weekDays.value.push({
      date: currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' }), // Дата в формате локали
      dayName: getDayName(currentDate.getDay()), // Название дня недели
      fullDate: currentDate.toLocaleDateString(),
    })
  }
}

const toggleCheckbox = (index: number, date: string) => {
  const historyData = {
    title: props.title,
    date: date,
  }
  emits('check', { index, historyData })
}
const handleInput = (index: number, event: Event, date: string) => {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (!isNaN(value)) {
    const historyData = {
      title: props.title,
      goal: props.target,
      date: date,
    }
    emits('input', { index, value, historyData })
  }
}

const getValue = computed(() => {
  const value = props.isBooleanType
    ? (props.value as boolean[]).filter((el) => el).length
    : (props.value as number[]).reduce((prev, current) => (prev += current), 0)
  return value > props.target && !props.isBooleanType ? props.target : value
})

onMounted(() => {
  getWeekDays()
})
</script>

<template>
  <div class="flex flex-col p-2 rounded-md relative shadow-md">
    <button
      class="absolute right-1 top-1 text-xl hover:scale-120 duration-300 cursor-pointer"
      @click="emits('delete')"
    >
      <Icon icon="material-symbols:close-rounded" />
    </button>
    <h2 class="text-lg font-bold text-center flex-1 px-4">{{ props.title }}</h2>
    <div class="flex items-center gap-4">
      <progress-bar class="flex-1" :max-value="props.target" :value="getValue" />
      <div class="basis-1/3">{{ getValue }} / {{ props.target }} {{ props.unit }}</div>
    </div>
    <div class="flex gap-2">
      <div
        class="flex items-center justify-center flex-col text-sm text-center"
        v-for="(day, index) in weekDays"
        :key="index"
      >
        <span>{{ day.dayName }}</span>
        <span>{{ day.date }}</span>
        <div
          v-if="props.isBooleanType"
          class="w-[4ch] aspect-square flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200"
          :class="{
            'bg-green-500': (props.value as boolean[])[index],
            'bg-red-500': !(props.value as boolean[])[index],
          }"
          @click="toggleCheckbox(index, day.fullDate)"
          @keydown.enter="toggleCheckbox(index, day.fullDate)"
          @keydown.space="toggleCheckbox(index, day.fullDate)"
          :tabindex="0"
          :aria-checked="(props.value as boolean[])[index]"
          role="checkbox"
        >
          <Transition name="icon">
            <Icon
              :icon="
                (props.value as boolean[])[index]
                  ? 'material-symbols:check-rounded'
                  : 'material-symbols:close-rounded'
              "
              class="text-white"
            />
          </Transition>
        </div>
        <input
          v-else
          type="number"
          class="border text-center w-[4ch] aspect-square rounded"
          :value="(props.value as number[])[index]"
          @input="handleInput(index, $event, day.fullDate)"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Убираем стрелки для всех браузеров */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Убираем стрелки для Firefox */
input[type='number'] {
  appearance: none;
  -moz-appearance: textfield;
}
.icon-enter-active,
.icon-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.icon-enter-from,
.icon-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
