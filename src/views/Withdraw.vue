<template>
  <MainLayout>
    <!-- Header Title -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="flex items-center py-4 px-4">
        <button @click="$router.go(-1)" class="mr-4 focus:outline-none">
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-2xl font-bold flex-grow text-center pr-8">Rút tiền</h1>
      </div>
    </div>

    <!-- Main Content with White Background -->
    <div class="bg-white rounded-t-[20px] flex-grow overflow-y-auto p-6 flex flex-col gap-6">
      <!-- Account Balance Card -->
      <div class="bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-4 text-white shadow-lg">
        <!-- Account Balance Label -->
        <div class="text-center text-white/90 mb-1">
          Số dư tài khoản
        </div>
        
        <!-- Balance Amount -->
        <div class="text-center text-4xl font-bold">
          {{ accountBalance }}
        </div>
        
        <!-- Loading Indicator for Balance -->
        <div v-if="isLoading" class="flex justify-center mt-2">
          <div class="animate-pulse flex space-x-1">
            <div class="h-2 w-2 bg-white rounded-full"></div>
            <div class="h-2 w-2 bg-white rounded-full"></div>
            <div class="h-2 w-2 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Has Bank Card -->
      <div v-if="hasBankCard" class="flex flex-col gap-6">
        <!-- Selected Bank Card -->
        <div class="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-2">
              <div class="text-2xl">🏦</div>
              <div class="font-medium text-[#08224C]">{{ selectedCard.bankName }}</div>
            </div>
            <button 
              @click="showCardSelectionModal = true" 
              class="text-blue-500 text-sm underline focus:outline-none"
            >
              Thay đổi
            </button>
          </div>
          <div class="flex flex-col gap-1 text-gray-600">
            <div class="flex justify-between">
              <span>Chủ tài khoản:</span>
              <span class="font-medium">{{ selectedCard.accountName }}</span>
            </div>
            <div class="flex justify-between">
              <span>Số tài khoản:</span>
              <span class="font-medium">{{ selectedCard.accountNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span>Chi nhánh:</span>
              <span class="font-medium">{{ selectedCard.branch }}</span>
            </div>
          </div>
        </div>

        <!-- Withdraw Form -->
        <form @submit.prevent="submitWithdrawal" class="flex flex-col gap-4">
          <!-- Amount Input -->
          <div class="flex flex-col gap-1">
            <label class="text-[#08224C] font-medium text-sm">Số tiền rút</label>
            <div class="relative">
              <input 
                type="number" 
                v-model="withdrawAmount" 
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
                placeholder="Nhập số tiền muốn rút"
                min="50000"
                :max="maxWithdrawAmount"
                required
              />
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">VND</span>
            </div>
            <p class="text-xs text-gray-500">Số tiền tối thiểu: 50,000 VND</p>
          </div>

          <!-- Quick Amount Buttons -->
          <div class="grid grid-cols-3 gap-2">
            <button 
              type="button" 
              v-for="amount in quickAmounts" 
              :key="amount"
              @click="withdrawAmount = amount"
              class="border border-gray-300 rounded-lg py-2 text-center hover:bg-gray-50 transition-colors focus:outline-none"
            >
              {{ formatCurrency(amount) }}
            </button>
          </div>

          <!-- Note Input -->
          <div class="flex flex-col gap-1 mt-2">
            <label class="text-[#08224C] font-medium text-sm">Ghi chú (không bắt buộc)</label>
            <textarea 
              v-model="withdrawNote" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C] resize-none"
              placeholder="Nhập ghi chú nếu cần"
              rows="3"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="bg-[#08224C] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#0a2d5e] transition-colors mt-4"
            :disabled="isLoading"
            @click="console.log('Button clicked', {withdrawAmount: withdrawAmount.value, isValidAmount: isValidAmount.value})"
          >
            <span v-if="isLoading">Đang xử lý...</span>
            <span v-else>Gửi yêu cầu rút tiền</span>
          </button>
        </form>

        <!-- Withdrawal Notes -->
        <div class="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          <h3 class="font-medium mb-2">Lưu ý:</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Yêu cầu rút tiền sẽ được xử lý trong vòng 24 giờ làm việc.</li>
            <li>Phí rút tiền: 0% (miễn phí).</li>
            <li>Số tiền tối thiểu cho mỗi lần rút: 50,000 VND.</li>
            <li>Vui lòng kiểm tra thông tin tài khoản ngân hàng trước khi gửi yêu cầu.</li>
          </ul>
        </div>
      </div>

      <!-- No Bank Card -->
      <div v-else-if="!isLoading" class="flex flex-col items-center justify-center py-10 text-gray-500">
        <div class="text-5xl mb-4">🏦</div>
        <p class="text-center mb-2">Bạn chưa có thông tin ngân hàng</p>
        <p class="text-center text-sm mb-6">Vui lòng thêm tên ngân hàng và số tài khoản để rút tiền</p>
        <router-link 
          to="/bank-cards" 
          class="bg-[#F87171] text-white py-3 px-6 rounded-lg font-medium shadow-md hover:bg-[#f65e5e] transition-colors"
        >
          Thêm thông tin ngân hàng
        </router-link>
      </div>
      
      <!-- Loading State -->
      <div v-else-if="isLoading && !hasBankCard" class="flex flex-col items-center justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#08224C]"></div>
        <p class="text-gray-500 mt-4">Đang tải thông tin...</p>
      </div>
    </div>

    <!-- Card Selection Modal -->
    <div v-if="showCardSelectionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl w-full">
        <div class="text-center mb-4">
          <h3 class="text-lg font-medium text-[#08224C]">Chọn thẻ ngân hàng</h3>
        </div>
        
        <div class="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          <div 
            v-for="(card, index) in bankCards" 
            :key="index"
            @click="selectCard(index)"
            class="bg-white rounded-lg shadow-sm p-3 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{'border-blue-500 bg-blue-50': selectedCardIndex === index}"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="text-xl">🏦</div>
              <div class="font-medium text-[#08224C]">{{ card.bankName }}</div>
            </div>
            <div class="flex flex-col gap-1 text-gray-600 text-sm">
              <div class="flex justify-between">
                <span>Chủ TK:</span>
                <span class="font-medium">{{ card.accountName }}</span>
              </div>
              <div class="flex justify-between">
                <span>Số TK:</span>
                <span class="font-medium">{{ card.accountNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-4">
          <button 
            @click="showCardSelectionModal = false" 
            class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
          >
            Hủy
          </button>
          <button 
            @click="confirmCardSelection" 
            class="flex-1 bg-[#08224C] text-white px-4 py-2 rounded-lg hover:bg-[#0a2d5e] transition-colors focus:outline-none"
            :disabled="selectedCardIndex === null"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div class="text-center mb-4">
          <div class="text-green-500 text-5xl mb-4">✓</div>
          <h3 class="text-lg font-medium text-[#08224C]">Thành công</h3>
        </div>
        <p class="text-gray-700 mb-6 text-center">
          Yêu cầu rút tiền của bạn đã được gửi thành công. Số tiền sẽ được tạm thời trừ khỏi ví của bạn, nếu giao dịch được chấp thuận, 
          số tiền sẽ được chuyển vào tài khoản của bạn trong vòng vài ngày làm việc. Nếu giao dịch bị từ chối hoặc hủy bỏ,
          số tiền sẽ được hoàn trả vào ví của bạn.
          Chúng tôi sẽ xử lý trong thời gian sớm nhất.
        </p>
        <div class="flex justify-center">
          <button 
            @click="closeSuccessModal" 
            class="bg-[#08224C] text-white px-4 py-2 rounded-lg hover:bg-[#0a2d5e] transition-colors focus:outline-none"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div class="text-center mb-4">
          <div class="text-red-500 text-5xl mb-4">✗</div>
          <h3 class="text-lg font-medium text-[#08224C]">Lỗi</h3>
        </div>
        <p class="text-gray-700 mb-6 text-center">
          {{ errorMessage }}
        </p>
        <div class="flex justify-center">
          <button 
            @click="showErrorModal = false" 
            class="bg-[#F87171] text-white px-4 py-2 rounded-lg hover:bg-[#f65e5e] transition-colors focus:outline-none"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { transactionService } from '../services/transaction.js'
import { authService } from '../services/auth.js'

const router = useRouter()

// Account balance
const accountBalance = ref('0 VNĐ')
const numericBalance = ref(0) // Numeric value for calculations

// Bank cards data
const bankCards = ref([])

// Check if user has bank cards
const hasBankCard = computed(() => bankCards.value.length > 0)

// Selected card
const selectedCardIndex = ref(0)
const selectedCard = computed(() => {
  if (hasBankCard.value && selectedCardIndex.value !== null) {
    return bankCards.value[selectedCardIndex.value]
  }
  return null
})

// Withdraw form
const withdrawAmount = ref('')
const withdrawNote = ref('')
const maxWithdrawAmount = computed(() => numericBalance.value)
const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000]

// UI state
const isLoading = ref(false)
const showCardSelectionModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Computed properties
const isValidAmount = computed(() => {
  const amount = Number(withdrawAmount.value)
  const valid = amount >= 50000 && amount <= numericBalance.value
  console.log('Validating amount:', {
    amount,
    numericBalance: numericBalance.value,
    maxWithdrawAmount: maxWithdrawAmount.value,
    valid
  })
  return valid
})

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
}

// Select card
const selectCard = (index) => {
  selectedCardIndex.value = index
}

// Confirm card selection
const confirmCardSelection = () => {
  if (selectedCardIndex.value !== null) {
    showCardSelectionModal.value = false
  }
}

// Submit withdrawal request
const submitWithdrawal = async () => {
  console.log('submitWithdrawal called', {
    withdrawAmount: withdrawAmount.value,
    numericBalance: numericBalance.value
  })
  
  // Chuyển đổi withdrawAmount từ string sang number
  const amount = Number(withdrawAmount.value)
  
  // Validate amount
  if (amount < 50000) {
    errorMessage.value = 'Số tiền rút tối thiểu là 50,000 VNĐ.'
    showErrorModal.value = true
    return
  }
  
  // Kiểm tra số dư
  if (amount > numericBalance.value) {
    errorMessage.value = 'Số dư tài khoản không đủ để thực hiện giao dịch này.'
    showErrorModal.value = true
    return
  }
  
  // Kiểm tra số tiền hợp lệ
  if (isNaN(amount) || amount <= 0) {
    errorMessage.value = 'Vui lòng nhập số tiền hợp lệ.'
    showErrorModal.value = true
    return
  }
  
  // Submit request
  isLoading.value = true
  
  try {
    console.log('Calling API with amount:', amount)
    
    // Gọi API yêu cầu rút tiền
    const response = await transactionService.requestWithdrawal(amount)
    
    console.log('API response:', response)
    
    if (response.success) {
      // Cập nhật số dư mới từ wallet của user
      // Kiểm tra cấu trúc response
      let walletBalance = response.wallet;
      
      // Nếu dữ liệu nằm trong trường data
      if (response.data && response.data.wallet !== undefined) {
        walletBalance = response.data.wallet;
      }
      
      console.log('Wallet balance from response:', walletBalance)
      
      // Chuyển đổi wallet từ string sang number
      numericBalance.value = parseFloat(walletBalance)
      accountBalance.value = new Intl.NumberFormat('vi-VN').format(numericBalance.value) + ' VNĐ'
      console.log('Updated wallet balance:', numericBalance.value)
      
      // Show success modal
      showSuccessModal.value = true
      
      // Reset form
      withdrawAmount.value = ''
      withdrawNote.value = ''
    } else {
      throw new Error(response.message || 'Có lỗi xảy ra khi xử lý yêu cầu rút tiền')
    }
  } catch (error) {
    console.error('Withdrawal error:', error)
    
    // Xử lý lỗi từ API
    if (error.response && error.response.data) {
      const responseData = error.response.data
      
      if (responseData.message) {
        errorMessage.value = responseData.message
      } else if (responseData.errors) {
        // Xử lý validation errors
        const firstError = Object.values(responseData.errors)[0]
        errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError
      } else {
        errorMessage.value = 'Có lỗi xảy ra khi xử lý yêu cầu rút tiền.'
      }
    } else {
      errorMessage.value = error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    }
    
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

// Close success modal and navigate to transactions page
const closeSuccessModal = () => {
  showSuccessModal.value = false
  // Chuyển đến màn hình giao dịch
  router.push('/transactions')
}

// Fetch user data on mount
onMounted(async () => {
  try {
    isLoading.value = true
    
    // Lấy thông tin người dùng
    const userData = await authService.getCurrentUser()
    
    // Cập nhật số dư ví
    if (userData && userData.wallet !== undefined) {
      // Chuyển đổi wallet từ string sang number để đảm bảo tính toán chính xác
      numericBalance.value = parseFloat(userData.wallet)
      accountBalance.value = new Intl.NumberFormat('vi-VN').format(numericBalance.value) + ' VNĐ'
      console.log('Wallet balance:', numericBalance.value)
    }
    
    // Kiểm tra thông tin ngân hàng - chỉ cần có bank_name và bank_account_number
    const hasBankInfo = userData && 
                       userData.bank_name && 
                       userData.bank_account_number;
    
    if (hasBankInfo) {
      // Người dùng đã có thông tin ngân hàng
      bankCards.value = [{
        bankName: userData.bank_name,
        accountName: userData.bank_account_name || 'Chưa cập nhật',
        accountNumber: userData.bank_account_number,
        branch: userData.bank_branch || 'Không có thông tin'
      }]
      
      // Chọn thẻ đầu tiên
      selectedCardIndex.value = 0
    } else {
      // Người dùng chưa có thông tin ngân hàng
      console.log('User has no bank information')
      bankCards.value = []
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    errorMessage.value = 'Không thể lấy thông tin người dùng. Vui lòng thử lại sau.'
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
})
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