<template>
  <nav class="flex justify-between items-center p-2">
    <router-link 
      v-for="item in navItems" 
      :key="item.path" 
      :to="item.path"
      class="flex flex-col items-center p-2"
      :class="{ 'text-primary': currentRoute === item.path, 'text-gray-500': currentRoute !== item.path }"
    >
      <div class="icon mb-1">
        <component :is="item.icon" />
      </div>
      <span class="text-xs">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const currentRoute = computed(() => route.path)

// Icons as components
const TrendIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
])

const TransactionIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
])

const HomeIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])

const MemberIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
])

const ChatIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-6 w-6', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
])

import { h } from 'vue'

const navItems = ref([
  { path: '/trends', label: 'Xu hướng', icon: TrendIcon },
  { path: '/transactions', label: 'Giao dịch', icon: TransactionIcon },
  { path: '/', label: 'Trang chủ', icon: HomeIcon },
  { path: '/member', label: 'Thành viên', icon: MemberIcon },
  { path: '/chat', label: 'Chat', icon: ChatIcon }
])

onMounted(async () => {
  try {
    const response = await axios.get('/api/menu')
    if (response.data && response.data.items) {
      // Update menu items if needed
      // navItems.value = response.data.items
    }
  } catch (error) {
    console.error('Error fetching menu:', error)
  }
})
</script>