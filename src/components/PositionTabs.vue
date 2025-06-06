<template>
  <div class="mb-4">
    <div class="flex overflow-x-auto">
      <button 
        v-for="position in positions" 
        :key="position.id"
        @click="selectPosition(position.id)"
        :class="[
          'tab whitespace-nowrap', 
          activePosition === position.id ? 'tab-active' : 'bg-gray-100'
        ]"
      >
        {{ position.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const positions = [
  { id: 'cNgan', name: 'C.Ngàn' },
  { id: 'ngan', name: 'Ngàn' },
  { id: 'tram', name: 'Trăm' },
  { id: 'chuc', name: 'Chục' },
  { id: 'donvi', name: 'Đơn vị' }
]

const activePosition = ref('cNgan')

const selectPosition = (positionId) => {
  activePosition.value = positionId
}
</script>