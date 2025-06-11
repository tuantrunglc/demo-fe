<template>
  <MainLayout>
    <!-- Header -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="flex items-center py-4 px-4">
        <button @click="$router.go(-1)" class="mr-4 focus:outline-none">
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-2xl font-bold flex-grow text-center pr-8">Lịch sử giao dịch</h1>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white pt-4 px-4 flex border-b">
      <button 
        @click="activeTab = 'transactions'" 
        class="flex-1 py-2 font-medium text-center transition-colors"
        :class="activeTab === 'transactions' ? 'text-[#08224C] border-b-2 border-[#08224C]' : 'text-gray-500'"
      >
        Nạp/Rút tiền
      </button>
      <button 
        @click="activeTab = 'bets'" 
        class="flex-1 py-2 font-medium text-center transition-colors"
        :class="activeTab === 'bets' ? 'text-[#08224C] border-b-2 border-[#08224C]' : 'text-gray-500'"
      >
        Lịch sử cược
      </button>
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

      <!-- Transaction History Tab -->
      <div v-if="activeTab === 'transactions' && !isLoading">
        <!-- Transaction History List -->
        <div v-if="transactions.length > 0" class="flex flex-col gap-4">
          <div v-for="transaction in transactions" :key="transaction.id" class="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <div class="text-2xl" v-if="transaction.deposit_amount > 0">💰</div>
                <div class="text-2xl" v-else>💸</div>
                <div class="font-medium text-[#08224C]">
                  {{ transaction.deposit_amount > 0 ? 'Nạp tiền' : 'Rút tiền' }}
                </div>
              </div>
              <div :class="{
                'text-green-500': transaction.status === 'confirmed',
                'text-red-500': transaction.status === 'rejected',
                'text-yellow-500': transaction.status === 'pending'
              }" class="font-medium">
                {{ getStatusText(transaction.status) }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2 text-gray-600">
              <div class="flex justify-between">
                <span>Số tiền:</span>
                <span class="font-medium" :class="{
                  'text-green-500': transaction.deposit_amount > 0,
                  'text-red-500': transaction.withdrawal_amount > 0
                }">
                  {{ transaction.deposit_amount > 0 
                    ? '+' + formatCurrency(transaction.deposit_amount) 
                    : '-' + formatCurrency(transaction.withdrawal_amount) }}
                </span>
              </div>
              <div class="flex justify-between" v-if="transaction.note">
                <span>Ghi chú:</span>
                <span class="font-medium">{{ transaction.note }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>Thời gian:</span>
                <span>{{ formatDate(transaction.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Transactions -->
        <div v-if="transactions.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-500">
          <div class="text-5xl mb-4">📊</div>
          <p class="text-center mb-2">Bạn chưa có giao dịch nạp/rút nào</p>
          <p class="text-center text-sm">Các giao dịch nạp/rút tiền sẽ được hiển thị tại đây</p>
        </div>
      </div>

      <!-- Bet History Tab -->
      <div v-if="activeTab === 'bets' && !isLoading">
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
import { ref, onMounted, watch } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { transactionService } from '../services/transaction.js'
import { betService } from '../services/bet.js'

// State
const transactions = ref([])
const bets = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const activeTab = ref('transactions') // Default tab

// Fetch data based on active tab
const fetchData = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    if (activeTab.value === 'transactions') {
      // Fetch transaction history
      const response = await transactionService.getTransactionHistory(20)
      
      if (response.success) {
        transactions.value = response.data.data || []
      } else {
        errorMessage.value = response.message || 'Không thể tải lịch sử giao dịch.'
      }
    } else if (activeTab.value === 'bets') {
      // Fetch bet history
      const response = await betService.getUserBetHistory()
      
      if (response.success) {
        bets.value = response.data || []
        console.log('Bet history:', bets.value)
      } else {
        errorMessage.value = response.message || 'Không thể tải lịch sử cược.'
      }
    }
  } catch (error) {
    console.error(`Error fetching ${activeTab.value}:`, error)
    errorMessage.value = `Không thể tải dữ liệu. Vui lòng thử lại sau.`
  } finally {
    isLoading.value = false
  }
}

// Watch for tab changes
watch(activeTab, () => {
  fetchData()
})

// Fetch initial data on component mount
onMounted(() => {
  fetchData()
})

// Helper functions
const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Đang xử lý',
    'confirmed': 'Đã xác nhận',
    'rejected': 'Đã từ chối'
  }
  return statusMap[status] || status
}

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