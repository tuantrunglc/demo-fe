<template>
  <MainLayout>
    <!-- Header Title -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="flex items-center py-4 px-4">
        <button @click="$router.go(-1)" class="mr-4 focus:outline-none">
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-2xl font-bold flex-grow text-center pr-8">Quản lý thẻ ngân hàng</h1>
      </div>
    </div>

    <!-- Main Content with White Background -->
    <div class="bg-white rounded-t-[20px] flex-grow overflow-y-auto p-6 flex flex-col gap-6">
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#08224C]"></div>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
      
      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>

      <!-- Bank Cards List -->
      <div v-if="!isLoading && bankCards.length > 0" class="flex flex-col gap-4">
        <div v-for="(card, index) in bankCards" :key="index" class="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-2">
              <div class="text-2xl">🏦</div>
              <div class="font-medium text-[#08224C]">{{ card.bankName }}</div>
            </div>
            <button @click="deleteCard(index)" class="text-red-500 focus:outline-none">
              <span>🗑️</span>
            </button>
          </div>
          <div class="flex flex-col gap-1 text-gray-600">
            <div class="flex justify-between">
              <span>Chủ tài khoản:</span>
              <span class="font-medium">{{ card.accountName }}</span>
            </div>
            <div class="flex justify-between">
              <span>Số tài khoản:</span>
              <span class="font-medium">{{ card.accountNumber }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && bankCards.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-500">
        <div class="text-5xl mb-4">💳</div>
        <p class="text-center mb-2">Bạn chưa có thẻ ngân hàng nào</p>
        <p class="text-center text-sm">Thêm thẻ ngân hàng để thuận tiện cho việc nạp/rút tiền</p>
      </div>

      <!-- Add New Card Button -->
      <button 
        @click="openAddCardModal" 
        class="bg-[#F87171] text-white py-3 rounded-lg font-medium shadow-md hover:bg-[#f65e5e] transition-colors mt-4 flex items-center justify-center gap-2"
        :disabled="isLoading"
      >
        <span>+</span>
        <span>{{ bankCards.length > 0 ? 'Cập nhật thông tin ngân hàng' : 'Thêm thẻ ngân hàng mới' }}</span>
      </button>
    </div>

    <!-- Add Card Modal -->
    <div v-if="showAddCardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl w-full">
        <div class="text-center mb-4">
          <h3 class="text-lg font-medium text-[#08224C]">
            {{ bankCards.length > 0 ? 'Cập nhật thông tin ngân hàng' : 'Thêm thẻ ngân hàng' }}
          </h3>
        </div>
        
        <form @submit.prevent="addCard" class="flex flex-col gap-4">
          <!-- Bank Selection -->
          <div class="flex flex-col gap-1">
            <label class="text-[#08224C] font-medium text-sm">Ngân hàng</label>
            <select 
              v-model="newCard.bankName" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
              required
            >
              <option value="" disabled>Chọn ngân hàng</option>
              <option v-for="bank in bankList" :key="bank" :value="bank">{{ bank }}</option>
            </select>
          </div>
          
          <!-- Account Name -->
          <div class="flex flex-col gap-1">
            <label class="text-[#08224C] font-medium text-sm">Tên chủ tài khoản</label>
            <input 
              type="text" 
              v-model="newCard.accountName" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
              placeholder="Nhập tên chủ tài khoản"
              required
            />
          </div>
          
          <!-- Account Number -->
          <div class="flex flex-col gap-1">
            <label class="text-[#08224C] font-medium text-sm">Số tài khoản</label>
            <input 
              type="text" 
              v-model="newCard.accountNumber" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#08224C]"
              placeholder="Nhập số tài khoản"
              required
            />
          </div>
          

          
          <!-- Action Buttons -->
          <div class="flex gap-3 mt-2">
            <button 
              type="button" 
              @click="showAddCardModal = false" 
              class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
              :disabled="isLoading"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              class="flex-1 bg-[#F87171] text-white px-4 py-2 rounded-lg hover:bg-[#f65e5e] transition-colors focus:outline-none"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <span class="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                Đang xử lý...
              </span>
              <span v-else>{{ bankCards.length > 0 ? 'Cập nhật' : 'Thêm' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
        <div class="text-center mb-4">
          <div class="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 class="text-lg font-medium text-[#08224C]">Xác nhận xóa</h3>
        </div>
        <p class="text-gray-700 mb-6 text-center">
          Bạn có chắc chắn muốn xóa thẻ ngân hàng này không?
        </p>
        <div class="flex justify-center gap-4">
          <button 
            @click="showDeleteModal = false" 
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
          >
            Hủy
          </button>
          <button 
            @click="confirmDelete" 
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { authService } from '../services/auth.js'

// Bank cards data
const bankCards = ref([])
const userBankInfo = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// List of banks
const bankList = [
  'Vietcombank',
  'BIDV',
  'Agribank',
  'VietinBank',
  'Techcombank',
  'MB Bank',
  'ACB',
  'TPBank',
  'VPBank',
  'HDBank',
  'SacomBank',
  'OCB'
]

// New card form
const newCard = ref({
  bankName: '',
  accountName: '',
  accountNumber: ''
})

// UI state
const showAddCardModal = ref(false)
const showDeleteModal = ref(false)
const cardToDeleteIndex = ref(null)

// Khi mở modal thêm/cập nhật thẻ, điền thông tin hiện có nếu có
const openAddCardModal = () => {
  // Nếu đã có thẻ ngân hàng, điền thông tin vào form
  if (bankCards.value.length > 0) {
    const currentCard = bankCards.value[0]
    newCard.value = {
      bankName: currentCard.bankName,
      accountName: currentCard.accountName,
      accountNumber: currentCard.accountNumber
    }
  }
  
  // Hiển thị modal
  showAddCardModal.value = true
}

// Fetch user profile on component mount
onMounted(async () => {
  try {
    isLoading.value = true
    const response = await authService.getUserProfile()
    
    if (response.success && response.data.bank_info) {
      const bankInfo = response.data.bank_info
      
      // Nếu người dùng đã có thông tin ngân hàng, hiển thị nó
      if (bankInfo.bank_name && bankInfo.bank_account_number && bankInfo.bank_account_name) {
        userBankInfo.value = {
          bank_name: bankInfo.bank_name,
          bank_account_number: bankInfo.bank_account_number,
          bank_account_name: bankInfo.bank_account_name
        }
        
        // Thêm thông tin ngân hàng vào danh sách thẻ
        bankCards.value = [{
          bankName: bankInfo.bank_name,
          accountName: bankInfo.bank_account_name,
          accountNumber: bankInfo.bank_account_number
        }]
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    errorMessage.value = 'Không thể tải thông tin ngân hàng. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
})

// Add new card
const addCard = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Chuẩn bị dữ liệu để gửi đến API
    const bankData = {
      bank_name: newCard.value.bankName,
      bank_account_name: newCard.value.accountName,
      bank_account_number: newCard.value.accountNumber
    }
    
    // Gọi API để cập nhật thông tin ngân hàng
    const response = await authService.updateBankInfo(bankData)
    
    if (response.success) {
      // Cập nhật thông tin ngân hàng trong state
      userBankInfo.value = {
        bank_name: bankData.bank_name,
        bank_account_name: bankData.bank_account_name,
        bank_account_number: bankData.bank_account_number
      }
      
      // Cập nhật danh sách thẻ
      bankCards.value = [{
        bankName: bankData.bank_name,
        accountName: bankData.bank_account_name,
        accountNumber: bankData.bank_account_number
      }]
      
      successMessage.value = 'Cập nhật thông tin ngân hàng thành công!'
      
      // Reset form
      newCard.value = {
        bankName: '',
        accountName: '',
        accountNumber: ''
      }
      
      // Close modal
      showAddCardModal.value = false
    } else {
      errorMessage.value = 'Không thể cập nhật thông tin ngân hàng. Vui lòng thử lại.'
    }
  } catch (error) {
    console.error('Error updating bank info:', error)
    errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin ngân hàng.'
  } finally {
    isLoading.value = false
  }
}

// Delete card
const deleteCard = (index) => {
  cardToDeleteIndex.value = index
  showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Gọi API để xóa thông tin ngân hàng (đặt các trường thành null)
    const response = await authService.updateBankInfo({
      bank_name: null,
      bank_account_name: null,
      bank_account_number: null
    })
    
    if (response.success) {
      // Xóa thông tin ngân hàng trong state
      userBankInfo.value = null
      
      // Xóa thẻ khỏi danh sách
      if (cardToDeleteIndex.value !== null) {
        bankCards.value.splice(cardToDeleteIndex.value, 1)
        cardToDeleteIndex.value = null
      }
      
      successMessage.value = 'Đã xóa thông tin ngân hàng thành công!'
    } else {
      errorMessage.value = 'Không thể xóa thông tin ngân hàng. Vui lòng thử lại.'
    }
  } catch (error) {
    console.error('Error deleting bank info:', error)
    errorMessage.value = error.response?.data?.message || 'Đã xảy ra lỗi khi xóa thông tin ngân hàng.'
  } finally {
    isLoading.value = false
    showDeleteModal.value = false
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