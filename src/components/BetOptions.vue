<template>
  <div class="mb-4">
    <div class="grid grid-cols-4 gap-2">
      <button 
        v-for="option in options" 
        :key="option.id"
        @click="selectOption(option.id)"
        :class="[
          'bet-option', 
          selectedOption === option.id ? 'bg-primary bg-opacity-10' : ''
        ]"
      >
        {{ option.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const options = [
  { id: 'up', name: 'Trên' },
  { id: 'down', name: 'Dưới' },
  { id: 'even', name: 'Đôi' },
  { id: 'odd', name: 'Đơn' }
]

const selectedOption = ref(null)

const selectOption = (optionId) => {
  selectedOption.value = optionId === selectedOption.value ? null : optionId
}
</script>