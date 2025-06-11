<template>
  <MainLayout>
    <!-- Header with title -->
    <div class="bg-[#08224C] text-white flex-shrink-0">
      <div class="flex justify-between items-center px-4 py-4">
        <h1 class="text-2xl font-bold">Xu hướng kỷ lục</h1>
        <button @click="refreshData" class="text-white">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>

      <!-- Level Tabs -->
      <div class="flex justify-center gap-2 px-4 pb-4">
        <button 
          v-for="level in [1, 3, 5]" 
          :key="level"
          @click="changeLevel(level)"
          :disabled="isLoading"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            currentLevel === level 
              ? 'bg-white text-[#08224C] font-bold shadow-md' 
              : 'text-white hover:bg-[#0a2d5e]'
          ]"
        >
          Level {{ level }}
        </button>
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-white rounded-t-[12px] flex-grow overflow-hidden flex flex-col">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center items-center py-8 flex-grow">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
      
      <template v-else>
        <!-- Table Header -->
        <div class="grid grid-cols-7 border-b border-gray-300 font-medium text-[#08224C] py-3 px-2 sticky top-0 bg-white shadow-sm">
          <div class="text-center col-span-1">Số kỳ</div>
          <div class="text-center col-span-5">Kết quả</div>
        </div>

        <!-- Table Body with Scrolling -->
        <div class="overflow-y-auto flex-grow">
          <!-- Empty state -->
          <div v-if="historyData.length === 0" class="flex justify-center items-center py-8 text-gray-500">
            Không có dữ liệu lịch sử
          </div>
          
          <div 
            v-else
            v-for="item in historyData" 
            :key="item.number_of_periods" 
            class="grid grid-cols-7 border-b border-gray-300 py-4 px-2 items-center"
          >
            <!-- Period Number -->
            <div class="text-center font-medium text-[#08224C] col-span-1">
              {{ item.number_of_periods }}
            </div>
            
            <!-- Results Balls -->
            <div class="flex justify-center gap-2 col-span-5">
              <div 
                v-for="(digit, index) in item.number.toString().padStart(5, '0').split('')" 
                :key="index"
                class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-white text-[#08224C] font-medium text-lg flex items-center justify-center shadow-md border border-gray-200"
              >
                {{ digit }}
              </div>
            </div>
            <!-- Generated Time -->
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import { ref, onMounted } from 'vue'
import { randomService } from '../services/random'

// State
const currentLevel = ref(3) // Default to Level 3
const historyData = ref([])
const isLoading = ref(false)

// Methods
const fetchHistory = async (level) => {
  try {
    isLoading.value = true
    const response = await randomService.getHistory(level, 10) // Limit to 10 records
    
    if (response.success && response.data) {
      historyData.value = response.data
      console.log('Lịch sử số ngẫu nhiên:', historyData.value)
    } else {
      historyData.value = []
      console.error('Không thể lấy dữ liệu lịch sử')
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử:', error)
    historyData.value = []
  } finally {
    isLoading.value = false
  }
}

const changeLevel = (level) => {
  if (level === currentLevel.value || isLoading.value) return
  
  currentLevel.value = level
  fetchHistory(level)
}

const refreshData = () => {
  fetchHistory(currentLevel.value)
}

const formatTime = (timeString) => {
  if (!timeString) return '--:--'
  
  // Extract only the time part if it's a full datetime
  if (timeString.includes(' ')) {
    return timeString.split(' ')[1]
  }
  
  return timeString
}

// Lifecycle hooks
onMounted(() => {
  fetchHistory(currentLevel.value)
})
</script>

<style scoped>
/* Custom scrollbar for the table */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
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