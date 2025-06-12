<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Quản lý Nổ Hũ</h1>
      <div class="flex space-x-2">
        <button 
          @click="openCreateModal" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Tạo mới
        </button>
        <button 
          @click="triggerJackpot" 
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          :disabled="isLoading"
        >
          <i class="fas fa-bolt mr-2"></i> Nổ Hũ Ngay
        </button>
      </div>
    </div>

    <!-- Thông báo -->
    <div v-if="notification.show" :class="`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`">
      {{ notification.message }}
    </div>

    <!-- Danh sách sự kiện -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-700">Danh sách sự kiện Nổ Hũ</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại phần thưởng</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="jackpotEvents.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                Chưa có sự kiện nổ hũ nào.
              </td>
            </tr>
            <tr v-for="event in jackpotEvents" :key="event.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ event.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span 
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${event.reward_type === 'coins' ? 'bg-green-100 text-green-800' : 
                      event.reward_type === 'gift' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`"
                >
                  {{ event.reward_type === 'coins' ? 'Coins' : 
                     event.reward_type === 'gift' ? 'Quà tặng' : 'Không trúng' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <template v-if="event.reward_type === 'coins'">
                  {{ formatCurrency(event.reward_amount) }}
                </template>
                <template v-else-if="event.reward_type === 'gift'">
                  {{ event.reward_description }}
                </template>
                <template v-else>
                  -
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span 
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      event.status === 'displayed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`"
                >
                  {{ event.status === 'pending' ? 'Chờ hiển thị' : 
                     event.status === 'displayed' ? 'Đã hiển thị' : 'Hết hạn' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(event.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewEvent(event)" class="text-indigo-600 hover:text-indigo-900 mr-2">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editEvent(event)" class="text-blue-600 hover:text-blue-900 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteEvent(event.id)" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Phân trang -->
      <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Trước
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sau
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> đến <span class="font-medium">{{ Math.min(currentPage * perPage, totalItems) }}</span> của <span class="font-medium">{{ totalItems }}</span> kết quả
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <i class="fas fa-chevron-left"></i>
              </button>
              <button v-for="page in paginationRange" :key="page" @click="goToPage(page)" :class="`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === page ? 'bg-blue-50 text-blue-600 border-blue-500 z-10' : 'bg-white text-gray-500 hover:bg-gray-50'}`">
                {{ page }}
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal tạo/chỉnh sửa sự kiện -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ editMode ? 'Chỉnh sửa sự kiện Nổ Hũ' : 'Tạo sự kiện Nổ Hũ mới' }}
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="saveEvent">
                    <div class="mb-4">
                      <label for="reward_type" class="block text-sm font-medium text-gray-700">Loại phần thưởng</label>
                      <select v-model="formData.reward_type" id="reward_type" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option value="">-- Chọn loại phần thưởng --</option>
                        <option value="coins">Coins</option>
                        <option value="gift">Quà tặng</option>
                        <option value="none">Không trúng</option>
                      </select>
                      <p v-if="errors.reward_type" class="mt-1 text-sm text-red-600">{{ errors.reward_type }}</p>
                    </div>

                    <div v-if="formData.reward_type === 'coins'" class="mb-4">
                      <label for="reward_amount" class="block text-sm font-medium text-gray-700">Số lượng coins</label>
                      <input type="number" v-model="formData.reward_amount" id="reward_amount" min="0" step="1000" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <p v-if="errors.reward_amount" class="mt-1 text-sm text-red-600">{{ errors.reward_amount }}</p>
                    </div>

                    <div v-if="formData.reward_type === 'gift'" class="mb-4">
                      <label for="reward_description" class="block text-sm font-medium text-gray-700">Mô tả phần thưởng</label>
                      <input type="text" v-model="formData.reward_description" id="reward_description" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                      <p v-if="errors.reward_description" class="mt-1 text-sm text-red-600">{{ errors.reward_description }}</p>
                    </div>

                    <div class="mb-4">
                      <label for="status" class="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select v-model="formData.status" id="status" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option value="pending">Chờ hiển thị</option>
                        <option value="displayed">Đã hiển thị</option>
                        <option value="expired">Hết hạn</option>
                      </select>
                      <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveEvent" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              {{ editMode ? 'Cập nhật' : 'Tạo mới' }}
            </button>
            <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem chi tiết -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Chi tiết sự kiện Nổ Hũ #{{ selectedEvent?.id }}
                </h3>
                <div class="mt-4">
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ selectedEvent?.id }}</dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Loại phần thưởng</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span 
                        :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${selectedEvent?.reward_type === 'coins' ? 'bg-green-100 text-green-800' : 
                            selectedEvent?.reward_type === 'gift' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`"
                      >
                        {{ selectedEvent?.reward_type === 'coins' ? 'Coins' : 
                           selectedEvent?.reward_type === 'gift' ? 'Quà tặng' : 'Không trúng' }}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Giá trị</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <template v-if="selectedEvent?.reward_type === 'coins'">
                        {{ formatCurrency(selectedEvent?.reward_amount) }}
                      </template>
                      <template v-else-if="selectedEvent?.reward_type === 'gift'">
                        {{ selectedEvent?.reward_description }}
                      </template>
                      <template v-else>
                        -
                      </template>
                    </dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Trạng thái</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span 
                        :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${selectedEvent?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            selectedEvent?.status === 'displayed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`"
                      >
                        {{ selectedEvent?.status === 'pending' ? 'Chờ hiển thị' : 
                           selectedEvent?.status === 'displayed' ? 'Đã hiển thị' : 'Hết hạn' }}
                      </span>
                    </dd>
                  </div>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Thời điểm hiển thị</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ selectedEvent?.displayed_at ? formatDate(selectedEvent.displayed_at) : 'Chưa hiển thị' }}
                    </dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Ngày tạo</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ formatDate(selectedEvent?.created_at) }}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeViewModal" type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { jackpotService } from '../../services/jackpot'

// State
const jackpotEvents = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const editMode = ref(false)
const selectedEvent = ref(null)
const formData = ref({
  reward_type: '',
  reward_amount: 0,
  reward_description: '',
  status: 'pending'
})
const errors = ref({})
const notification = ref({
  show: false,
  type: 'success',
  message: ''
})

// Pagination
const currentPage = ref(1)
const perPage = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value))
const paginationRange = computed(() => {
  const range = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i)
    }
  } else {
    let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i)
    }
  }
  
  return range
})

// Methods
const fetchJackpotEvents = async () => {
  isLoading.value = true
  try {
    const response = await jackpotService.getJackpotHistory(perPage.value)
    if (response.success) {
      jackpotEvents.value = response.data.data
      totalItems.value = response.data.total
    } else {
      showNotification('error', 'Không thể tải danh sách sự kiện nổ hũ')
    }
  } catch (error) {
    console.error('Error fetching jackpot events:', error)
    showNotification('error', 'Đã xảy ra lỗi khi tải danh sách sự kiện nổ hũ')
  } finally {
    isLoading.value = false
  }
}

const triggerJackpot = async () => {
  isLoading.value = true
  try {
    const response = await jackpotService.triggerJackpot({
      reward_type: 'random' // Backend sẽ tự động chọn loại phần thưởng ngẫu nhiên
    })
    
    if (response.success) {
      showNotification('success', 'Đã kích hoạt nổ hũ thành công!')
      fetchJackpotEvents()
    } else {
      showNotification('error', response.message || 'Không thể kích hoạt nổ hũ')
    }
  } catch (error) {
    console.error('Error triggering jackpot:', error)
    showNotification('error', 'Đã xảy ra lỗi khi kích hoạt nổ hũ')
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  editMode.value = false
  formData.value = {
    reward_type: '',
    reward_amount: 0,
    reward_description: '',
    status: 'pending'
  }
  errors.value = {}
  showModal.value = true
}

const editEvent = (event) => {
  editMode.value = true
  formData.value = {
    id: event.id,
    reward_type: event.reward_type,
    reward_amount: event.reward_amount,
    reward_description: event.reward_description,
    status: event.status
  }
  errors.value = {}
  showModal.value = true
}

const viewEvent = (event) => {
  selectedEvent.value = event
  showViewModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedEvent.value = null
}

const validateForm = () => {
  const newErrors = {}
  
  if (!formData.value.reward_type) {
    newErrors.reward_type = 'Vui lòng chọn loại phần thưởng'
  }
  
  if (formData.value.reward_type === 'coins' && (!formData.value.reward_amount || formData.value.reward_amount <= 0)) {
    newErrors.reward_amount = 'Vui lòng nhập số lượng coins hợp lệ'
  }
  
  if (formData.value.reward_type === 'gift' && !formData.value.reward_description) {
    newErrors.reward_description = 'Vui lòng nhập mô tả phần thưởng'
  }
  
  if (!formData.value.status) {
    newErrors.status = 'Vui lòng chọn trạng thái'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const saveEvent = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  try {
    let response
    
    if (editMode.value) {
      // Update existing event
      response = await jackpotService.updateJackpot(formData.value.id, formData.value)
    } else {
      // Create new event
      response = await jackpotService.createJackpot(formData.value)
    }
    
    if (response.success) {
      showNotification('success', editMode.value ? 'Cập nhật sự kiện thành công!' : 'Tạo sự kiện mới thành công!')
      closeModal()
      fetchJackpotEvents()
    } else {
      showNotification('error', response.message || 'Không thể lưu sự kiện')
    }
  } catch (error) {
    console.error('Error saving jackpot event:', error)
    showNotification('error', 'Đã xảy ra lỗi khi lưu sự kiện')
  } finally {
    isLoading.value = false
  }
}

const deleteEvent = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return
  
  isLoading.value = true
  try {
    const response = await jackpotService.deleteJackpot(id)
    
    if (response.success) {
      showNotification('success', 'Xóa sự kiện thành công!')
      fetchJackpotEvents()
    } else {
      showNotification('error', response.message || 'Không thể xóa sự kiện')
    }
  } catch (error) {
    console.error('Error deleting jackpot event:', error)
    showNotification('error', 'Đã xảy ra lỗi khi xóa sự kiện')
  } finally {
    isLoading.value = false
  }
}

const showNotification = (type, message) => {
  notification.value = {
    show: true,
    type,
    message
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchJackpotEvents()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchJackpotEvents()
  }
}

const goToPage = (page) => {
  currentPage.value = page
  fetchJackpotEvents()
}

// Lifecycle hooks
onMounted(() => {
  fetchJackpotEvents()
})
</script>