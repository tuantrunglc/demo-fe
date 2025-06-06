<template>
  <div class="mb-4">
    <div class="grid grid-cols-5 gap-2">
      <div 
        v-for="number in numbers" 
        :key="number.value"
        @click="selectNumber(number.value)"
        :class="[
          'number-grid-item', 
          selectedNumbers.includes(number.value) ? 'bg-primary bg-opacity-10' : ''
        ]"
      >
        <div class="text-lg font-bold">{{ number.value }}</div>
        <div class="text-sm text-gray-600">{{ number.price }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const numbers = [
  { value: 0, price: '9.99' },
  { value: 1, price: '9.99' },
  { value: 2, price: '9.99' },
  { value: 3, price: '9.99' },
  { value: 4, price: '9.99' },
  { value: 5, price: '9.99' },
  { value: 6, price: '9.99' },
  { value: 7, price: '9.99' },
  { value: 8, price: '9.99' },
  { value: 9, price: '9.99' }
]

const selectedNumbers = ref([])

const selectNumber = (value) => {
  if (selectedNumbers.value.includes(value)) {
    selectedNumbers.value = selectedNumbers.value.filter(n => n !== value)
  } else {
    selectedNumbers.value.push(value)
  }
}
</script>