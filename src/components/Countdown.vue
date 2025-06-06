<template>
  <div class="text-center text-sm font-medium mb-4">
    Kỳ tiếp theo: {{ nextDrawId }} - {{ formattedTime }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const nextDrawId = ref('37247')
const countdown = ref(9) // seconds
const formattedTime = ref('00:09')

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

let timer = null

const startCountdown = () => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
      formattedTime.value = formatTime(countdown.value)
    } else {
      // Reset countdown and fetch new draw
      clearInterval(timer)
      fetchNextDraw()
    }
  }, 1000)
}

const fetchNextDraw = async () => {
  try {
    const response = await axios.get('/api/latest-result')
    if (response.data) {
      nextDrawId.value = response.data.next_draw_id
      countdown.value = response.data.next_draw_countdown || 60
      formattedTime.value = formatTime(countdown.value)
      startCountdown()
    }
  } catch (error) {
    console.error('Error fetching next draw:', error)
    // Restart countdown anyway
    countdown.value = 60
    formattedTime.value = formatTime(countdown.value)
    startCountdown()
  }
}

onMounted(() => {
  fetchNextDraw()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>