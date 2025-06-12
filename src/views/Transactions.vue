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

    <!-- Tab Navigation -->
    <div class="bg-white border-b">
      <div class="flex justify-center">
        <div class="flex text-base font-medium">
          <button 
            @click="activeTab = 'bet-history'" 
            :class="[
              'px-6 py-3 border-b-2',
              activeTab === 'bet-history' ? 'border-[#08224C] text-[#08224C]' : 'border-transparent text-gray-500'
            ]"
          >
            Lịch sử cược
          </button>
          <button 
            @click="activeTab = 'transaction-history'" 
            :class="[
              'px-6 py-3 border-b-2',
              activeTab === 'transaction-history' ? 'border-[#08224C] text-[#08224C]' : 'border-transparent text-gray-500'
            ]"
          >
            Danh sách nạp rút
          </button>
        </div>
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

      <!-- Bet History Tab Content -->
      <div v-if="!isLoading && activeTab === 'bet-history'">
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
                'text-green-500': bet.status === 'win',
                'text-red-500': bet.status === 'lost',
                'text-yellow-500': !bet.status
              }" class="font-medium">
                {{ getBetResultText(bet.status) }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2 text-gray-600">
              <div class="flex justify-between">
                <span>Số tiền cược:</span>
                <span class="font-medium">{{ formatCurrency(bet.value) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tiền lãi:</span>
                <span class="font-medium" :class="{
                  'text-green-500': bet.amount > 0,
                  'text-red-500': bet.amount < 0
                }">
                  {{ bet.amount > 0 ? '+' + formatCurrency(bet.amount) : formatCurrency(bet.amount) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Số cược:</span>
                <span class="font-medium">{{ bet.feature_number }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>Thời gian:</span>
                <span>{{ formatDate(bet.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for Bet History -->
        <div v-if="bets.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-500">
          <div class="text-5xl mb-4">🎮</div>
          <p class="text-center mb-2">Bạn chưa có lịch sử cược nào</p>
          <p class="text-center text-sm">Các lịch sử cược sẽ được hiển thị tại đây</p>
        </div>
      </div>

      <!-- Transaction History Tab Content -->
      <div v-if="!isLoading && activeTab === 'transaction-history'">
        <!-- Transaction History List -->
        <div v-if="transactions.length > 0" class="flex flex-col gap-4">
          <div v-for="(transaction, index) in transactions" :key="transaction.id || index" class="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <div class="text-2xl">
                  {{ getTransactionIcon(transaction.type) }}
                </div>
                <div class="font-medium text-[#08224C]">
                  {{ getTransactionTypeText(transaction.type) }}
                </div>
              </div>
              <div :class="{
                'text-green-500': transaction.status === 'completed' || transaction.status === 'confirmed' || transaction.status === 'success',
                'text-yellow-500': transaction.status === 'pending' || transaction.status === 'processing',
                'text-red-500': transaction.status === 'rejected' || transaction.status === 'failed' || transaction.status === 'cancelled'
              }" class="font-medium">
                {{ getTransactionStatusText(transaction.status) }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2 text-gray-600">
              <div class="flex justify-between">
                <span>Số tiền:</span>
                <span class="font-medium" :class="{
                  'text-green-500': transaction.type === 'deposit',
                  'text-red-500': transaction.type === 'withdraw'
                }">
                  {{ transaction.type === 'deposit' ? '+' : transaction.type === 'withdraw' ? '-' : '' }}
                  {{ formatCurrency(transaction.amount) }}
                </span>
              </div>
              <div v-if="transaction.note" class="flex justify-between">
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

        <!-- Empty State for Transaction History -->
        <div v-if="transactions.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-500">
          <div class="text-5xl mb-4">💰</div>
          <p class="text-center mb-2">Bạn chưa có giao dịch nạp/rút nào</p>
          <p class="text-center text-sm">Lịch sử nạp/rút sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { betService } from '../services/bet.js'
import { transactionService } from '../services/transaction.js'

// Tab state
const activeTab = ref('bet-history') // Default tab

// State for data
const bets = ref([])
const transactions = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

// Fetch bet history data
const fetchBetHistory = async () => {
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

// Fetch transaction history data
const fetchTransactionHistory = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Fetch transaction history
    const response = await transactionService.getTransactionHistory()
    console.log('Raw transaction response:', response)
    
    // Kiểm tra cấu trúc response
    if (response && response.success) {
      // Xác định nơi dữ liệu được lưu trữ - dựa trên cấu trúc API thực tế
      let transactionData = []
      
      if (response.data && response.data.data) {
        // Cấu trúc API thực tế: response.data.data chứa mảng các giao dịch
        transactionData = response.data.data
      } else if (response.data) {
        transactionData = response.data
      } else if (Array.isArray(response)) {
        transactionData = response
      }
      
      // Chuyển đổi dữ liệu để phù hợp với giao diện
      transactions.value = transactionData.map(transaction => {
        // Xác định loại giao dịch (nạp/rút) dựa trên deposit_amount và withdrawal_amount
        let type = 'unknown'
        let amount = 0
        
        if (transaction.deposit_amount && parseFloat(transaction.deposit_amount) > 0) {
          type = 'deposit'
          amount = parseFloat(transaction.deposit_amount)
        } else if (transaction.withdrawal_amount && parseFloat(transaction.withdrawal_amount) > 0) {
          type = 'withdraw'
          amount = parseFloat(transaction.withdrawal_amount)
        }
        
        return {
          id: transaction.id,
          type: type,
          amount: amount,
          status: transaction.status,
          note: transaction.note,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        }
      })
      
      console.log('Processed transaction history:', transactions.value)
    } else {
      console.error('Transaction API response format issue:', response)
      errorMessage.value = (response && response.message) || 'Không thể tải lịch sử nạp/rút.'
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    errorMessage.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}

// Watch for tab changes to load appropriate data
watch(activeTab, (newTab) => {
  if (newTab === 'bet-history') {
    fetchBetHistory()
  } else if (newTab === 'transaction-history') {
    fetchTransactionHistory()
  }
})

// Fetch initial data on component mount
onMounted(() => {
  if (activeTab.value === 'bet-history') {
    fetchBetHistory()
  } else if (activeTab.value === 'transaction-history') {
    fetchTransactionHistory()
  }
})

// Helper functions
const getBetResultText = (result) => {
  if (!result) return 'Đang xử lý'
  
  const resultMap = {
    'won': 'Thắng',
    'lost': 'Thua'
  }
  return resultMap[result] || result
}

const getTransactionIcon = (type) => {
  if (!type) return '💱'
  
  const iconMap = {
    'deposit': '💰',
    'withdraw': '💸',
    'transfer': '↔️',
    'bonus': '🎁',
    'refund': '↩️',
    'bet': '🎮',
    'win': '🏆',
    'lose': '📉'
  }
  return iconMap[type] || '💱'
}

const getTransactionTypeText = (type) => {
  if (!type) return 'Giao dịch'
  
  const typeMap = {
    'deposit': 'Nạp tiền',
    'withdraw': 'Rút tiền',
    'transfer': 'Chuyển khoản',
    'bonus': 'Tiền thưởng',
    'refund': 'Hoàn tiền',
    'bet': 'Đặt cược',
    'win': 'Thắng cược',
    'lose': 'Thua cược'
  }
  return typeMap[type] || type
}

const getTransactionStatusText = (status) => {
  if (!status) return 'Đang xử lý'
  
  const statusMap = {
    'pending': 'Đang chờ',
    'processing': 'Đang xử lý',
    'completed': 'Hoàn thành',
    'confirmed': 'Đã xác nhận',
    'success': 'Thành công',
    'rejected': 'Bị từ chối',
    'failed': 'Thất bại',
    'cancelled': 'Đã hủy'
  }
  return statusMap[status] || status
}

const formatCurrency = (amount) => {
  // Kiểm tra nếu amount là undefined hoặc null
  if (amount === undefined || amount === null) {
    return '0'
  }
  
  // Đảm bảo amount là số
  const numericAmount = Number(amount)
  if (isNaN(numericAmount)) {
    console.warn('Invalid amount value:', amount)
    return '0'
  }
  
  return new Intl.NumberFormat('vi-VN').format(numericAmount)
}

const formatDate = (dateString) => {
  // Kiểm tra nếu dateString là undefined hoặc null
  if (!dateString) {
    return 'N/A'
  }
  
  try {
    const date = new Date(dateString)
    
    // Kiểm tra nếu date không hợp lệ
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return 'N/A'
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
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