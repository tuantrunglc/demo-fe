<template>
  <MainLayout>
    <!-- Header -->
    <div class="text-white flex-shrink-0">
      <div class="flex justify-between items-center px-3 py-2 min-h-[60px]">
        <div class="text-2xl italic font-bold font-[Lemonada] bg-[#08224C] text-white w-10 h-10 flex items-center justify-center rounded-full">d</div>
        <div class="text-white font-medium text-base">
          Kết quả kỳ <span class="bg-white text-[#08224C] px-2 py-0.5 mx-1 rounded-full font-bold shadow">{{ randomData.number_of_periods || '-----' }}</span> hôm nay
        </div>
        <button class="text-white text-base">ℹ️</button>
      </div>

      <!-- Current Number Display -->
      <div class="flex flex-col items-center mb-3">
        <div class="text-sm text-white mb-1">Số hiện tại</div>
        <div class="flex justify-center gap-2">
          <template v-if="isLoading">
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </template>
          <template v-else>
            <div v-for="(num, index) in displayNumbers" :key="index"
                class="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-white text-[#08224C] font-bold flex items-center justify-center shadow-md">
              {{ num }}
            </div>
          </template>
        </div>
      </div>

      <!-- Countdown -->
      <div class="flex flex-col text-white text-base px-3 mb-2">
        <div class="flex justify-between mb-1">
          <div>Kỳ tiếp theo: <span class="font-medium">{{ randomData.number_of_periods ? Number(randomData.number_of_periods) + 1 : '-----' }}</span></div>
          <div class="flex items-center gap-1">
            ⏰ <span :class="{ 'text-red-400 font-bold animate-pulse': countdown <= 10 }">{{ formattedCountdown }}</span>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="w-full bg-gray-700 rounded-full h-2 mb-1">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-linear"
            :class="{ 'bg-red-500': countdown <= 10 }"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <!-- Generated time -->
      </div>

      <!-- Level Tabs -->
      <div class="flex justify-around text-base font-medium text-white mb-2">
        <button 
          @click="changeLevel(1)" 
          :class="{ 'border-b-2 border-white': currentLevel === 1 }"
          :disabled="isLoading"
        >
          Level 1
        </button>
        <button 
          @click="changeLevel(3)" 
          :class="{ 'border-b-2 border-white': currentLevel === 3 }"
          :disabled="isLoading"
        >
          Level 3
        </button>
        <button 
          @click="changeLevel(5)" 
          :class="{ 'border-b-2 border-white': currentLevel === 5 }"
          :disabled="isLoading"
        >
          Level 5
        </button>
      </div>
    </div>

    <!-- Main Section: white background -->
    <div class="bg-white rounded-t-[12px] pt-4 text-[#08224C] flex flex-col flex-grow overflow-hidden">
      <div class="flex-grow">
        <!-- Number type Tabs -->
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 rounded-full p-1 flex text-base font-medium shadow-inner">
            <button 
              @click="activeTab = 'so15'" 
              :class="[
                'px-4 py-1 rounded-full',
                activeTab === 'so15' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow' : 'text-[#08224C]'
              ]"
            >
              Số 1 ~ 5
            </button>
            <button 
              @click="activeTab = 'tonghoa'" 
              :class="[
                'px-4 py-1 rounded-full',
                activeTab === 'tonghoa' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow' : 'text-[#08224C]'
              ]"
            >
              Tổng hòa
            </button>
          </div>
        </div>

        <!-- Content for "Số 1 ~ 5" tab -->
        <div v-if="activeTab === 'so15'">
          <!-- Options -->
          <div class="grid grid-cols-2 text-center text-[#F18CB1] font-medium text-lg border-t border-gray-200">
            <div class="border border-gray-200 py-2 cursor-pointer" @click="openNumberPicker('up')">
              Trên<br><span class="text-base font-medium text-gray-600">1.99</span>
            </div>
            <div class="border border-gray-200 py-2 cursor-pointer" @click="openNumberPicker('down')">
              Dưới<br><span class="text-base font-medium text-gray-600">1.99</span>
            </div>
            <div class="border border-gray-200 py-2 cursor-pointer" @click="openNumberPicker('Đôi')">
              Đôi<br><span class="text-base font-medium text-gray-600">1.99</span>
            </div>
            <div class="border border-gray-200 py-2 cursor-pointer" @click="openNumberPicker('Đơn')">
              Đơn<br><span class="text-base font-medium text-gray-600">1.99</span>
            </div>
          </div>
          
          <!-- Bet Status Messages -->
          <div v-if="betSuccess || betError" class="mt-4 px-4">
            <div v-if="betSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span class="block sm:inline">Đặt cược thành công!</span>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="betSuccess = false">
                <svg class="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Đóng</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </span>
            </div>
            <div v-if="betError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span class="block sm:inline">{{ betError }}</span>
              <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="betError = ''">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Đóng</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
              </span>
            </div>
          </div>

          <!-- Numbers -->
          <div class="text-center text-[#F18CB1] font-medium text-lg border border-t-0 border-gray-200">
            <!-- Row 1: 0,1,2,3 -->
            <div class="grid grid-cols-4">
              <div v-for="n in 4" :key="n" class="border border-gray-200 py-2">
                {{ n - 1 }}<br><span class="text-base font-medium text-gray-600">9.99</span>
              </div>
            </div>
            
            <!-- Row 2: 4,5,6,7 -->
            <div class="grid grid-cols-4">
              <div v-for="n in 4" :key="n+4" class="border border-gray-200 py-2">
                {{ n + 3 }}<br><span class="text-base font-medium text-gray-600">9.99</span>
              </div>
            </div>
            
            <!-- Row 3: 8,9 (8 width = 2 cells, 9 width = 2 cells) -->
            <div class="grid grid-cols-4">
              <div class="col-span-2 border border-gray-200 py-2">
                8<br><span class="text-base font-medium text-gray-600">9.99</span>
              </div>
              <div class="col-span-2 border border-gray-200 py-2">
                9<br><span class="text-base font-medium text-gray-600">9.99</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content for "Tổng hòa" tab -->
        <div v-if="activeTab === 'tonghoa'" class="px-2">
          <!-- Title bar for "Tổng 3 hàng cuối cùng" -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 text-center font-medium rounded-t-md mb-0 shadow">
            Tổng 3 hàng cuối cùng
          </div>

          <!-- Numbers grid: 7 columns x 4 rows = 28 cells (0-27) -->
          <div class="border-x border-b border-gray-200">
            <!-- Row 1: 0-6 -->
            <div class="grid grid-cols-7">
              <div v-for="n in 7" :key="n-1" class="border border-gray-200 py-2 text-center">
                <div class="text-[#F18CB1] font-medium text-lg">{{ n-1 }}</div>
                <div class="text-base font-medium text-gray-600">{{ (n-1) * 30 + 120 }}</div>
              </div>
            </div>
            
            <!-- Row 2: 7-13 -->
            <div class="grid grid-cols-7">
              <div v-for="n in 7" :key="n+6" class="border border-gray-200 py-2 text-center">
                <div class="text-[#F18CB1] font-medium text-lg">{{ n+6 }}</div>
                <div class="text-base font-medium text-gray-600">{{ (n+6) * 25 + 50 }}</div>
              </div>
            </div>
            
            <!-- Row 3: 14-20 -->
            <div class="grid grid-cols-7">
              <div v-for="n in 7" :key="n+13" class="border border-gray-200 py-2 text-center">
                <div class="text-[#F18CB1] font-medium text-lg">{{ n+13 }}</div>
                <div class="text-base font-medium text-gray-600">{{ (n+13) * 20 + 30 }}</div>
              </div>
            </div>
            
            <!-- Row 4: 21-27 -->
            <div class="grid grid-cols-7">
              <div v-for="n in 7" :key="n+20" class="border border-gray-200 py-2 text-center">
                <div class="text-[#F18CB1] font-medium text-lg">{{ n+20 }}</div>
                <div class="text-base font-medium text-gray-600">{{ (n+20) * 15 + 20 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
  
  <!-- Number Picker Box (Modal) -->
  <NumberPickerBox 
    v-if="showNumberPicker" 
    :initialAmount="betAmount"
    :initialOptions="quickOptions"
    :optionTitle="'Đặt cược ' + (selectedOption === 'up' ? 'Trên' : selectedOption === 'down' ? 'Dưới' : selectedOption)"
    :walletBalance="walletBalance"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import NumberPickerBox from '../components/NumberPickerBox.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { randomService } from '../services/random'
import { betService } from '../services/bet'
import { authService } from '../services/auth'
import { eventBus } from '../utils/eventBus'

// Tab state management
const activeTab = ref('so15') // Default to "Số 1 ~ 5" tab

// Number picker state
const showNumberPicker = ref(false)
const selectedOption = ref('')
const betAmount = ref(100)
const quickOptions = ref([50, 100, 150, 200, 250, 300])

// Bet state
const selectedPosition = ref(1) // Default to position 1 (always set to 1)
const isPlacingBet = ref(false) // Flag to indicate if a bet is being placed
const betError = ref('') // Error message if bet fails
const betSuccess = ref(false) // Flag to indicate if bet was successful
const walletBalance = ref(0) // User's wallet balance

// Random number state
const currentLevel = ref(3) // Default to Level 3
const randomData = ref({})
const isLoading = ref(false)

// Countdown configuration for each level
const countdownConfig = {
  1: { 
    duration: 60, // 1 minute in seconds
    lastFetch: 0,
    countdown: ref(0),
    interval: null,
    progressPercent: ref(0),
    data: ref({})
  },
  3: { 
    duration: 180, // 3 minutes in seconds
    lastFetch: 0,
    countdown: ref(0),
    interval: null,
    progressPercent: ref(0),
    data: ref({})
  },
  5: { 
    duration: 300, // 5 minutes in seconds
    lastFetch: 0,
    countdown: ref(0),
    interval: null,
    progressPercent: ref(0),
    data: ref({})
  }
}

// Computed properties for current level
const countdown = computed(() => countdownConfig[currentLevel.value].countdown.value)
const progressPercent = computed(() => countdownConfig[currentLevel.value].progressPercent.value)

// Computed properties
const displayNumbers = computed(() => {
  if (!randomData.value.number) return ['0', '0', '0', '0', '0']
  
  // Convert the number to a string and pad with leading zeros if needed
  const numberStr = randomData.value.number.toString().padStart(5, '0')
  
  // Return an array of individual digits
  return numberStr.split('')
})

const formattedCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Methods
const fetchLatestRandomNumber = async (level = null, generate = null) => {
  // If no level is provided, use the current level
  const targetLevel = level || currentLevel.value
  
  try {
    isLoading.value = true
    
    // Record the fetch time
    countdownConfig[targetLevel].lastFetch = Date.now()
    
    console.log(`Gọi API cho level ${targetLevel} với tham số generate=${generate || 'không có'}`)
    
    const response = await randomService.getLatest(targetLevel, generate)
    
    if (response.success && response.data) {
      console.log(`Nhận dữ liệu thành công cho level ${targetLevel}:`, response.data)
      
      // Store data for the specific level
      countdownConfig[targetLevel].data.value = response.data
      
      // Also update the main randomData if this is the current level
      if (targetLevel === currentLevel.value) {
        randomData.value = response.data
      }
      
      // Calculate the next fetch time and start countdown
      startCountdown(targetLevel, response.data.generated_at)
    } else {
      console.error(`API trả về lỗi cho level ${targetLevel}:`, response)
      // If there's an error response, still start a countdown for the next attempt
      startCountdown(targetLevel)
    }
  } catch (error) {
    console.error(`Lỗi khi gọi API cho level ${targetLevel}:`, error)
    // If there's an error, still start a countdown for the next attempt
    startCountdown(targetLevel)
  } finally {
    isLoading.value = false
  }
}

// Calculate the next fetch time based on the level
const calculateNextFetchTime = (level) => {
  const now = new Date()
  const nextFetch = new Date(now)
  
  // Reset milliseconds
  nextFetch.setMilliseconds(0)
  
  // Calculate next fetch time based on level
  if (level === 1) {
    // Level 1: Next minute, second 1 (after command runs at second 0)
    nextFetch.setSeconds(1)
    
    // If we've passed second 1 of current minute, move to next minute
    if (now.getSeconds() >= 1) {
      nextFetch.setMinutes(now.getMinutes() + 1)
    }
  } else if (level === 3) {
    // Level 3: Next minute divisible by 3, second 21 (after command runs at second 20)
    nextFetch.setSeconds(21)
    
    const currentMinute = now.getMinutes()
    const remainder = currentMinute % 3
    
    if (remainder === 0 && now.getSeconds() < 21) {
      // Still in current minute and before second 21
      // Keep current minute
    } else {
      // Past second 21 of current minute or not a minute divisible by 3
      // Calculate next minute divisible by 3
      const minutesToAdd = remainder === 0 ? 3 : 3 - remainder
      nextFetch.setMinutes(currentMinute + minutesToAdd)
    }
  } else if (level === 5) {
    // Level 5: Next minute divisible by 5, second 42 (after command runs at second 40)
    nextFetch.setSeconds(42)
    
    const currentMinute = now.getMinutes()
    const remainder = currentMinute % 5
    
    if (remainder === 0 && now.getSeconds() < 42) {
      // Still in current minute and before second 42
      // Keep current minute
    } else {
      // Past second 42 of current minute or not a minute divisible by 5
      // Calculate next minute divisible by 5
      const minutesToAdd = remainder === 0 ? 5 : 5 - remainder
      nextFetch.setMinutes(currentMinute + minutesToAdd)
    }
  }
  
  console.log(`Level ${level}: Thời gian gọi API tiếp theo: ${nextFetch.toLocaleTimeString()}`)
  return nextFetch
}

const startCountdown = (level, generatedTime = null) => {
  // Get the level config
  const levelConfig = countdownConfig[level]
  
  // Clear any existing interval for this level
  if (levelConfig.interval) {
    clearInterval(levelConfig.interval)
    levelConfig.interval = null
  }
  
  // Calculate the next fetch time
  const nextFetchTime = calculateNextFetchTime(level)
  
  // Calculate initial countdown value
  const now = new Date()
  const diffMs = nextFetchTime - now
  const initialSeconds = Math.max(0, Math.floor(diffMs / 1000))
  
  // Set initial countdown value for this level
  levelConfig.countdown.value = initialSeconds
  
  // Calculate initial progress percentage (inverted: 100% at start, 0% at end)
  levelConfig.progressPercent.value = 100 - (initialSeconds / levelConfig.duration * 100)
  
  console.log(`Level ${level}: Bắt đầu đếm ngược, còn lại ${initialSeconds}s, tiến trình: ${levelConfig.progressPercent.value}%`)
  
  // Start the countdown interval for this level
  levelConfig.interval = setInterval(() => {
    // Calculate remaining time
    const currentTime = new Date()
    const remainingMs = nextFetchTime - currentTime
    
    if (remainingMs <= 0) {
      // Time's up, fetch new data
      clearInterval(levelConfig.interval)
      levelConfig.interval = null
      
      const currentSecond = new Date().getSeconds()
      
      // Check if it's the right time to call API after command runs
      const isCommandExecutionTime = 
        (level === 1 && currentSecond === 1) || 
        (level === 3 && currentSecond === 21) || 
        (level === 5 && currentSecond === 41)
      
      console.log(`Level ${level}: Đếm ngược kết thúc, thời điểm hiện tại: ${currentTime.toLocaleTimeString()}, giây: ${currentSecond}`)
      console.log(`Level ${level}: Đúng thời điểm gọi API? ${isCommandExecutionTime ? 'Có' : 'Không'}`)
      
      if (isCommandExecutionTime) {
        // When it's the right time after command runs, always generate new number
        console.log(`Level ${level}: Gọi API với tham số generate=generate`)
        fetchLatestRandomNumber(level, 'generate')
      } else {
        // When it's not the right time after command runs, just get current data
        console.log(`Level ${level}: Gọi API với tham số generate=not_generate`)
        fetchLatestRandomNumber(level, 'not_generate')
      }
      
      return
    }
    
    // Convert to seconds
    const remainingSeconds = Math.floor(remainingMs / 1000)
    
    // Update countdown value for this level
    levelConfig.countdown.value = remainingSeconds
    
    // Calculate progress percentage (inverted: 100% at start, 0% at end)
    levelConfig.progressPercent.value = 100 - (remainingSeconds / levelConfig.duration * 100)
    
    // Check if we're close to the end (10 seconds or less)
    if (remainingSeconds <= 10 && remainingSeconds % 2 === 0) {
      console.log(`Level ${level}: Sắp hết thời gian, còn ${remainingSeconds}s`)
    }
  }, 1000)
}

const changeLevel = (level) => {
  if (level === currentLevel.value || isLoading.value) return
  
  // Update current level
  currentLevel.value = level
  
  // If we don't have data for this level yet, fetch it
  if (!countdownConfig[level].data.value.number) {
    fetchLatestRandomNumber(level, 'not_generate')
  } else {
    // Otherwise, just update the main randomData with the level's data
    randomData.value = countdownConfig[level].data.value
    
    // If this level doesn't have an active countdown, start one
    if (!countdownConfig[level].interval) {
      startCountdown(level, countdownConfig[level].data.value.generated_at)
    }
  }
}

// Open number picker when clicking on an option
const openNumberPicker = (option) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!authService.isAuthenticated()) {
    betError.value = 'Vui lòng đăng nhập để đặt cược'
    return
  }
  
  // Kiểm tra xem có số ngẫu nhiên không
  if (!randomData.value || !randomData.value.number) {
    betError.value = 'Không có số ngẫu nhiên để đặt cược'
    return
  }
  
  selectedOption.value = option
  showNumberPicker.value = true
}

// Handle confirm action from number picker
const handleConfirm = async (amount) => {
  betAmount.value = amount
  showNumberPicker.value = false
  
  // Chỉ xử lý đặt cược cho 'up' và 'down'
  if (selectedOption.value !== 'up' && selectedOption.value !== 'down') {
    betError.value = 'Chức năng này chưa được hỗ trợ'
    return
  }
  
  try {
    isPlacingBet.value = true
    betError.value = ''
    betSuccess.value = false
    
    // Chuẩn bị dữ liệu đặt cược
    const betData = {
      random_number: randomData.value.number,
      target: 1, // Vị trí mục tiêu luôn là 1
      bet_type: selectedOption.value, // 'up' hoặc 'down'
      value: amount, // Số tiền đặt cược
      level: currentLevel.value.toString(), // Cấp độ đặt cược
      number_of_periods: randomData.value.number_of_periods // Số kỳ đặt cược
    }
    
    console.log('Đang đặt cược:', betData)
    
    // Gọi API đặt cược
    const response = await betService.createBet(betData)
    
    console.log('Kết quả đặt cược:', response)
    
    if (response.success) {
      betSuccess.value = true
      // Cập nhật số tiền trong ví và thông báo cho FooterAccount
      await fetchUserWalletBalance()
      // Kích hoạt sự kiện cập nhật số dư ví
      eventBus.emit('update-wallet')
      // Tự động ẩn thông báo thành công sau 1 giây
      setTimeout(() => {
        betSuccess.value = false
      }, 1000)
    } else {
      betError.value = response.message || 'Đặt cược thất bại'
    }
  } catch (error) {
    console.error('Lỗi khi đặt cược:', error)
    
    if (error.response && error.response.data) {
      betError.value = error.response.data.message || 'Đặt cược thất bại'
    } else {
      betError.value = 'Đặt cược thất bại. Vui lòng thử lại sau.'
    }
  } finally {
    isPlacingBet.value = false
  }
}

// Handle cancel action from number picker
const handleCancel = () => {
  showNumberPicker.value = false
}

// Fetch user wallet balance
const fetchUserWalletBalance = async () => {
  if (authService.isAuthenticated()) {
    try {
      const userData = await authService.getCurrentUser()
      if (userData && userData.wallet) {
        walletBalance.value = parseFloat(userData.wallet)
        console.log('User wallet balance:', walletBalance.value)
      }
    } catch (error) {
      console.error('Error fetching user wallet balance:', error)
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  // Initialize all levels
  const levels = [1, 3, 5]
  
  // Start with the current level
  fetchLatestRandomNumber(currentLevel.value, 'not_generate')
  
  // Then initialize the other levels in the background
  setTimeout(() => {
    levels.forEach(level => {
      if (level !== currentLevel.value) {
        fetchLatestRandomNumber(level, 'not_generate')
      }
    })
  }, 1000) // Delay to avoid too many simultaneous requests
  
  // Fetch user wallet balance
  fetchUserWalletBalance()
})

onBeforeUnmount(() => {
  // Clear all intervals when component is unmounted
  [1, 3, 5].forEach(level => {
    if (countdownConfig[level].interval) {
      clearInterval(countdownConfig[level].interval)
      countdownConfig[level].interval = null
    }
  })
})
</script>