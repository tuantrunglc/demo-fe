<template>
  <div class="w-full pt-2">
    <!-- Account Balance -->
    <div class="bg-[#2B4460] text-white font-medium rounded-full px-5 mx-auto mt-2 mb-2 h-[40px] flex items-center justify-between max-w-[90%]">
      <div>
        <span class="text-sm">ID: {{ accountId || 'Loading...' }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-sm mr-2">Số dư:</span>
        <span class="text-[#F18CB1] font-medium">
          <span v-if="!isHidden">{{ formatBalance(accountBalance) }}</span>
          <span v-else>***</span>
        </span>
        <button @click="toggleVisibility" class="focus:outline-none ml-2">
          <span v-if="isHidden" class="text-xs">👁️</span>
          <span v-else class="text-xs">🙈</span>
        </button>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <div class="flex justify-around text-sm text-[#08224C] font-medium py-2 w-full">
      <router-link to="/trends" class="flex flex-col items-center nav-link" exact-active-class="active-link">
        <span class="nav-icon">📈</span><span>Xu hướng</span>
        <div class="indicator"></div>
      </router-link>
      <router-link to="/transactions" class="flex flex-col items-center nav-link" exact-active-class="active-link">
        <span class="nav-icon">💱</span><span>Giao dịch</span>
        <div class="indicator"></div>
      </router-link>
      <router-link to="/" class="flex flex-col items-center nav-link" exact-active-class="active-link">
        <span class="nav-icon">🏠</span><span>Trang chủ</span>
        <div class="indicator"></div>
      </router-link>
      <router-link to="/member" class="flex flex-col items-center nav-link" exact-active-class="active-link">
        <span class="nav-icon">👤</span><span>Thành viên</span>
        <div class="indicator"></div>
      </router-link>
      <button @click="toggleCrispChat" class="flex flex-col items-center nav-link">
        <span class="nav-icon">💬</span><span>Chat</span>
        <div class="indicator"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { authService } from '../services/auth'
import { eventBus } from '../utils/eventBus'

const accountId = ref('4482')
const accountBalance = ref('0')
const isHidden = ref(true)
const isCrispLoaded = ref(false)
const isCrispVisible = ref(false)

const toggleVisibility = () => {
  isHidden.value = !isHidden.value
}

// Không cần hàm loadCrispScript riêng biệt nữa vì đã tích hợp vào toggleCrispChat

// Preload Crisp script
const preloadCrispScript = () => {
  if (isCrispLoaded.value || window.$crisp) return;
  
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "2e9f022b-b3d4-4906-95f3-3056b4d2a2f3";
  
  // Tạo script element
  const script = document.createElement('script');
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  
  // Khi script được tải, đánh dấu là đã tải
  script.onload = () => {
    isCrispLoaded.value = true;
    console.log('Crisp script preloaded');
  };
  
  // Thêm script vào head
  document.head.appendChild(script);
}

// Function to toggle Crisp Chat visibility - optimized for speed
const toggleCrispChat = () => {
  // Nếu Crisp đã được tải, hiển thị nó ngay lập tức
  if (window.$crisp) {
    // Sử dụng requestAnimationFrame để đảm bảo UI được cập nhật trước khi hiển thị chat
    requestAnimationFrame(() => {
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
      isCrispVisible.value = true;
    });
    return;
  }
  
  // Nếu Crisp chưa được tải, tải và hiển thị nó
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "2e9f022b-b3d4-4906-95f3-3056b4d2a2f3";
  
  // Tạo script element với priority hints
  const script = document.createElement('script');
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  
  // Thêm thuộc tính để tăng ưu tiên tải
  script.setAttribute('importance', 'high');
  
  // Khi script được tải, hiển thị chatbox ngay lập tức
  script.onload = () => {
    isCrispLoaded.value = true;
    
    // Giảm thời gian chờ xuống 100ms
    setTimeout(() => {
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:show"]);
        window.$crisp.push(["do", "chat:open"]);
        isCrispVisible.value = true;
        console.log('Crisp chat opened');
      }
    }, 100);
  };
  
  // Thêm script vào head
  document.head.appendChild(script);
}

// Format balance to remove decimal places if they are .00
const formatBalance = (balance) => {
  if (!balance) return '0'
  
  // Convert to number if it's a string
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
  
  // Check if the number has no decimal places or only zeros after decimal
  if (Number.isInteger(numBalance) || numBalance.toFixed(2).endsWith('.00')) {
    return Math.floor(numBalance).toString()
  }
  
  return numBalance.toString()
}

// Hàm cập nhật số dư ví
const updateWalletBalance = async () => {
  try {
    const response = await authService.getUserProfile();
    if (response && response.data) {
      accountId.value = response.data.user?.id || '0'
      accountBalance.value = response.data.wallet_info?.balance || '0'
    }
  } catch (error) {
    console.error('Error fetching account info:', error)
  }
}

onMounted(async () => {
  try {
    // Tải song song cả thông tin người dùng và script Crisp
    const profilePromise = authService.getUserProfile();
    
    // Tải trước script Crisp để sẵn sàng khi người dùng nhấp vào nút chat
    preloadCrispScript();
    
    // Đợi thông tin người dùng
    const response = await profilePromise;
    if (response && response.data) {
      accountId.value = response.data.user?.id || '0'
      accountBalance.value = response.data.wallet_info?.balance || '0'
    }
    
    // Đăng ký lắng nghe sự kiện cập nhật số dư ví
    eventBus.on('update-wallet', updateWalletBalance);
  } catch (error) {
    console.error('Error fetching account info:', error)
  }
})

onUnmounted(() => {
  // Clean up if needed
  if (isCrispLoaded.value && isCrispVisible.value) {
    window.$crisp.push(["do", "chat:hide"])
  }
  
  // Hủy đăng ký sự kiện
  eventBus.off('update-wallet', updateWalletBalance);
})
</script>

<style scoped>
.nav-link {
  position: relative;
  transition: transform 0.2s ease, background-color 0.2s ease;
  padding: 8px 12px;
  border-radius: 8px;
  will-change: transform, background-color;
}

.active-link {
  color: #F18CB1;
  font-weight: 600;
  transform: translateY(-4px);
  background-color: rgba(241, 140, 177, 0.1);
}

.active-link .nav-icon {
  transform: scale(1.3);
  display: inline-block;
  transition: transform 0.2s ease;
  will-change: transform;
}

.indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 4px;
  background-color: #F18CB1;
  border-radius: 4px;
  transition: width 0.2s ease;
  will-change: width;
}

.active-link .indicator {
  width: 70%;
  box-shadow: 0 0 8px rgba(241, 140, 177, 0.5);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* Account balance styles */
.bg-[#2B4460] {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>