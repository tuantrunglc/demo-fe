<template>
  <div class="mb-4">
    <div class="flex border rounded-lg overflow-hidden">
      <button 
        v-for="level in levels" 
        :key="level.id"
        @click="selectLevel(level.id)"
        :class="[
          'tab flex-1', 
          activeLevel === level.id ? 'tab-active' : 'bg-gray-100'
        ]"
      >
        {{ level.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const levels = [
  { id: 1, name: 'Level 1' },
  { id: 3, name: 'Level 3' },
  { id: 5, name: 'Level 5' }
]

const activeLevel = ref(3)

const selectLevel = (levelId) => {
  activeLevel.value = levelId
}
</script>