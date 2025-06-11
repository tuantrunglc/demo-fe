<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-md p-4 max-w-[400px] w-full mx-4">
      <!-- Title showing selected option -->
      <div class="text-center mb-3 font-medium text-lg text-[#08224C]">
        {{ optionTitle }}
      </div>
      <!-- Number Input with +/- buttons -->
      <div class="flex items-center justify-center mb-4">
        <button 
          @click="decreaseAmount" 
          class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-l-md border border-gray-300 text-lg font-bold"
        >
          –
        </button>
        <input 
          type="number" 
          v-model="amount" 
          class="w-28 h-10 text-center font-bold border-t border-b border-gray-300 shadow-sm text-lg"
          min="1"
          step="1"
          @input="validateAmount"
        />
        <button 
          @click="increaseAmount" 
          class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-r-md border border-gray-300 text-lg font-bold"
        >
          +
        </button>
      </div>

      <!-- Quick Pick Buttons - First Row -->
      <div class="grid grid-cols-3 gap-2 mb-2">
        <button 
          v-for="option in quickOptions.slice(0, 3)" 
          :key="option"
          @click="setAmount(option)"
          :class="[
            'py-2 rounded-md text-center font-medium',
            amount === option 
              ? 'bg-[#F87171] text-white' 
              : 'bg-white border border-gray-200 text-gray-800'
          ]"
        >
          {{ option }}
        </button>
      </div>

      <!-- Quick Pick Buttons - Second Row -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button 
          v-for="option in quickOptions.slice(3, 6)" 
          :key="option"
          @click="setAmount(option)"
          :class="[
            'py-2 rounded-md text-center font-medium',
            amount === option 
              ? 'bg-[#F87171] text-white' 
              : 'bg-white border border-gray-200 text-gray-800'
          ]"
        >
          {{ option }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col items-center gap-2">
        <button 
          @click="confirm" 
          class="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#5E87F0] to-[#4A6FD6] text-lg shadow-md"
        >
          Xác nhận
        </button>
        <button 
          @click="cancel" 
          class="w-full py-2 font-medium text-gray-700 mt-1"
        >
          Huỷ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  initialAmount: {
    type: Number,
    default: 100
  },
  initialOptions: {
    type: Array,
    default: () => [50, 100, 150, 200, 250, 300]
  },
  optionTitle: {
    type: String,
    default: 'Chọn số lượng'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const amount = ref(props.initialAmount);
const quickOptions = ref(props.initialOptions);

const increaseAmount = () => {
  amount.value += 1;
};

const decreaseAmount = () => {
  if (amount.value > 1) {
    amount.value -= 1;
  } else {
    amount.value = 1; // Ensure minimum value is 1
  }
};

const validateAmount = () => {
  // Ensure amount is at least 1
  if (amount.value < 1) {
    amount.value = 1;
  }
  
  // Ensure amount is an integer
  amount.value = Math.floor(amount.value);
};

const setAmount = (value) => {
  amount.value = value;
};

const confirm = () => {
  emit('confirm', amount.value);
};

const cancel = () => {
  emit('cancel');
};
</script>