<template>
  <div class="bg-[#08224C] min-h-screen max-w-[430px] mx-auto font-sans pb-[108px] font-medium text-base">
    <!-- Header -->
    <div class="text-white">
      <div class="flex justify-between items-center px-3 py-2 min-h-[60px]">
        <div class="text-2xl italic font-bold font-[Lemonada] bg-[#08224C] text-white w-10 h-10 flex items-center justify-center rounded-full">d</div>
        <div class="text-white font-medium text-base">
          Kết quả kỳ <span class="bg-white text-[#08224C] px-2 py-0.5 mx-1 rounded-full font-bold shadow">37422</span> hôm nay
        </div>
        <button class="text-white text-base">ℹ️</button>
      </div>

      <!-- Balls -->
      <div class="flex justify-center gap-2 mb-3">
        <div v-for="num in ['6','7','5','4','8']" :key="num"
             class="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-white text-[#08224C] font-bold flex items-center justify-center shadow-md">
          {{ num }}
        </div>
      </div>

      <!-- Countdown -->
      <div class="flex justify-between text-white text-base px-3 mb-2">
        <div>Kỳ tiếp theo: <span class="font-medium">37424</span></div>
        <div class="flex items-center gap-1">⏰ <span>02:33</span></div>
      </div>

      <!-- Level Tabs -->
      <div class="flex justify-around text-base font-medium text-white mb-2">
        <button>Level 1</button>
        <button class="border-b-2 border-white">Level 3</button>
        <button>Level 5</button>
      </div>
    </div>

    <!-- Main Section: white background -->
    <div class="bg-white rounded-t-[12px] pt-4 text-[#08224C] flex flex-col min-h-[calc(100vh-200px)]">
      <div class="flex-grow">
        <!-- Number type Tabs -->
        <div class="flex justify-center mb-4">
          <div class="bg-gray-100 rounded-full p-1 flex text-base font-medium shadow-inner">
            <button class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-4 py-1 shadow">Số 1 ~ 5</button>
            <button class="text-[#08224C] px-4 py-1">Tổng hòa</button>
          </div>
        </div>

        <!-- Position Tabs -->
        <div class="flex justify-center gap-1 px-4 mb-4 text-base font-medium">
          <button class="bg-blue-500 text-white font-medium px-3 py-1 rounded shadow">C.Ngàn</button>
          <button class="bg-white text-blue-500 border border-blue-300 px-3 py-1 rounded">Ngàn</button>
          <button class="bg-white text-blue-500 border border-blue-300 px-3 py-1 rounded">Trăm</button>
          <button class="bg-white text-blue-500 border border-blue-300 px-3 py-1 rounded">Chục</button>
          <button class="bg-white text-blue-500 border border-blue-300 px-3 py-1 rounded">Đơn vị</button>
        </div>

        <!-- Options -->
        <div class="grid grid-cols-2 text-center text-[#F18CB1] font-medium text-lg border-t border-gray-200">
          <div class="border border-gray-200 py-2">Trên<br><span class="text-base font-medium text-gray-600">1.99</span></div>
          <div class="border border-gray-200 py-2">Dưới<br><span class="text-base font-medium text-gray-600">1.99</span></div>
          <div class="border border-gray-200 py-2">Đôi<br><span class="text-base font-medium text-gray-600">1.99</span></div>
          <div class="border border-gray-200 py-2">Đơn<br><span class="text-base font-medium text-gray-600">1.99</span></div>
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

      <!-- Balance - positioned at bottom -->
      <div class="bg-[#2B4460] text-white text-base font-medium rounded-full px-4 mx-2 mt-auto mb-6 h-[45px] flex items-center justify-between">
        <div>Số dư tài khoản ID: 4646</div>
        <div class="flex items-center gap-2 text-[#F18CB1] font-medium">
          <span>0</span>🙈
        </div>
      </div>
    </div>

    <!-- Bottom nav -->
    <footer class="fixed bottom-0 left-0 w-full max-w-[430px] bg-white rounded-t-[20px] shadow z-10">
      <div class="flex justify-around text-sm text-[#08224C] font-medium py-2">
        <div class="flex flex-col items-center"><span>📈</span><span>Xu hướng</span></div>
        <div class="flex flex-col items-center"><span>💱</span><span>Giao dịch</span></div>
        <div class="flex flex-col items-center text-blue-600"><span>🏠</span><span>Trang chủ</span></div>
        <div class="flex flex-col items-center"><span>👤</span><span>Thành viên</span></div>
        <div class="flex flex-col items-center"><span>💬</span><span>Chat</span></div>
      </div>
    </footer>
  </div>
</template>