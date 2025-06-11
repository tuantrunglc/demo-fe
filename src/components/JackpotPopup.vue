<template>
  <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-70"></div>
    
    <!-- Popup Content -->
    <div class="relative z-10 bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4 transform transition-all">
      <!-- Jackpot Animation -->
      <div class="jackpot-animation bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6 text-center">
        <div class="animate-bounce text-6xl mb-4">💰</div>
        <h2 class="text-3xl font-bold text-white mb-2 animate-pulse">NỔ HŨ!!!</h2>
        <div class="text-white text-xl font-semibold">Chúc mừng bạn!</div>
        
        <!-- Confetti Animation -->
        <div class="confetti-container">
          <div v-for="n in 50" :key="n" 
               class="confetti"
               :style="{
                 '--fall-delay': `${Math.random() * 5}s`,
                 '--fall-duration': `${Math.random() * 5 + 3}s`,
                 '--left-pos': `${Math.random() * 100}%`,
                 '--bg-color': getRandomColor(),
                 '--rotation': `${Math.random() * 360}deg`,
               }">
          </div>
        </div>
      </div>
      
      <!-- Reward Details -->
      <div class="p-6 text-center">
        <div class="mb-4">
          <div v-if="jackpotEvent.reward_type === 'coins'" class="text-2xl font-bold text-green-600">
            + {{ formatCurrency(jackpotEvent.reward_amount) }}
          </div>
          <div v-else-if="jackpotEvent.reward_type === 'gift'" class="text-2xl font-bold text-blue-600">
            {{ jackpotEvent.reward_description }}
          </div>
          <div v-else class="text-2xl font-bold text-gray-600">
            Chúc bạn may mắn lần sau!
          </div>
        </div>
        
        <button @click="closePopup" class="bg-[#08224C] text-white px-6 py-3 rounded-full font-bold hover:bg-opacity-90 transition-colors">
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { jackpotService } from '../services/jackpot'

const props = defineProps({
  jackpotEvent: {
    type: Object,
    required: true
  }
})

const showPopup = ref(false)
const audioElement = ref(null)

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

// Get random color for confetti
const getRandomColor = () => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
  return colors[Math.floor(Math.random() * colors.length)]
}

// Close popup and mark as displayed
const closePopup = async () => {
  showPopup.value = false
  
  if (audioElement.value) {
    audioElement.value.pause()
  }
  
  // Mark jackpot as displayed
  await jackpotService.markAsDisplayed(props.jackpotEvent.id)
}

onMounted(() => {
  // Show popup with a slight delay for better UX
  setTimeout(() => {
    showPopup.value = true
    
    // Play sound effect
    audioElement.value = new Audio('https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3')
    audioElement.value.play().catch(error => {
      console.error('Error playing audio:', error)
    })
  }, 500)
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})
</script>

<style scoped>
.jackpot-animation {
  position: relative;
  overflow: hidden;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--bg-color);
  top: -20px;
  left: var(--left-pos);
  opacity: 0.8;
  transform: rotate(var(--rotation));
  animation: fall var(--fall-duration) var(--fall-delay) linear infinite;
}

@keyframes fall {
  0% {
    top: -20px;
    transform: rotate(0deg);
  }
  100% {
    top: 100%;
    transform: rotate(360deg);
  }
}
</style>