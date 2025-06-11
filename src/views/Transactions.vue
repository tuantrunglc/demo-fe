<template>
  <MainLayout>
    <!-- Header -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="flex items-center py-4 px-4">
        <button @click="$router.go(-1)" class="mr-4 focus:outline-none">
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-2xl font-bold flex-grow text-center pr-8">Lịch sử cược</h1>
      </div>
    </div>

    <!-- Main Content with White Background -->
    <div class="bg-white flex-grow overflow-y-auto p-6 flex flex-col gap-6">
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#08224C]"></div>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <!-- Bet History -->
      <div v-if="!isLoading">
        <!-- Bet History List -->
        <div v-if="bets.length > 0" class="flex flex-col gap-4">
          <div v-for="bet in bets" :key="bet.id" class="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <div class="text-2xl">🎮</div>
                <div class="font-medium text-[#08224C]">
                  Cược {{ bet.bet_type === 'up' ? 'Lên' : 'Xuống' }}
                </div>
              </div>
              <div :class="{
                'text-green-500': bet.result === 'win',
                'text-red-500': bet.result === 'lose',
                'text-yellow-500': !bet.result
              }" class="font-medium">
                {{ getBetResultText(bet.result) }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2 text-gray-600">
              <div class="flex justify-between">
                <span>Số tiền cược:</span>
                <span class="font-medium">{{ formatCurrency(bet.value) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Kết quả:</span>
                <span class="font-medium" :class="{
                  'text-green-500': bet.profit > 0,
                  'text-red-500': bet.profit < 0
                }">
                  {{ bet.profit > 0 ? '+' + formatCurrency(bet.profit) : formatCurrency(bet.profit) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Số ngẫu nhiên:</span>
                <span class="font-medium">{{ bet.random_number }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>Thời gian:</span>
                <span>{{ formatDate(bet.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Bets -->
        <div v-if="bets.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-500">
          <div class="text-5xl mb-4">🎮</div>
          <p class="text-center mb-2">Bạn chưa có lịch sử cược nào</p>
          <p class="text-center text-sm">Các lịch sử cược sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { betService } from '../services/bet.js'

// State
const bets = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

// Fetch bet history data
const fetchData = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Fetch bet history
    const response = await betService.getUserBetHistory()
    
    if (response.success) {
      bets.value = response.data || []
      console.log('Bet history:', bets.value)
    } else {
      errorMessage.value = response.message || 'Không thể tải lịch sử cược.'
    }
  } catch (error) {
    console.error('Error fetching bet history:', error)
    errorMessage.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Fetch initial data on component mount
onMounted(() => {
  fetchData()
})

// Helper functions
const getBetResultText = (result) => {
  if (!result) return 'Đang xử lý'
  
  const resultMap = {
    'win': 'Thắng',
    'lose': 'Thua',
    'draw': 'Hòa'
  }
  return resultMap[result] || result
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>