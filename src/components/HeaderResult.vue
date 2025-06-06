<template>
  <div class="mb-4">
    <h2 class="text-center text-lg font-medium mb-2">Kết quả kỳ {{ drawId }} hôm nay</h2>
    <div class="flex justify-center space-x-2">
      <div v-for="(number, index) in numbers" :key="index" class="ball">
        {{ number }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const drawId = ref('37246')
const numbers = ref([9, 1, 8, 7, 5])

onMounted(async () => {
  try {
    const response = await axios.get('/api/latest-result')
    if (response.data) {
      drawId.value = response.data.draw_id
      numbers.value = response.data.numbers
    }
  } catch (error) {
    console.error('Error fetching latest result:', error)
  }
})
</script>