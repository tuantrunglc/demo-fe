<template>
  <div class="mb-4">
    <div class="flex border rounded-lg overflow-hidden">
      <button 
        v-for="type in betTypes" 
        :key="type.id"
        @click="selectType(type.id)"
        :class="[
          'tab flex-1', 
          activeType === type.id ? 'tab-active' : 'bg-gray-100'
        ]"
      >
        {{ type.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const betTypes = [
  { id: 'number', name: 'Số 1~5' },
  { id: 'sum', name: 'Tổng hòa' }
]

const activeType = ref('number')

const selectType = (typeId) => {
  activeType.value = typeId
}
</script>