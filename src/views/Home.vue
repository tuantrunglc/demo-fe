<template>
  <div class="flex flex-col h-screen">
    <!-- Header Section -->
    <header class="p-4">
      <div class="flex justify-center mb-2">
        <h1 class="text-xl font-bold">Lottery App</h1>
      </div>
      <HeaderResult />
      <Countdown />
    </header>

    <!-- Main Content -->
    <main class="flex-grow overflow-y-auto p-4">
      <LevelTabs />
      <TypeTabs />
      <PositionTabs />
      <BetOptions />
      <NumberGrid />
    </main>

    <!-- Footer Section -->
    <footer class="bg-white border-t">
      <FooterAccount />
      <BottomNav />
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HeaderResult from '../components/HeaderResult.vue'
import Countdown from '../components/Countdown.vue'
import LevelTabs from '../components/LevelTabs.vue'
import TypeTabs from '../components/TypeTabs.vue'
import PositionTabs from '../components/PositionTabs.vue'
import BetOptions from '../components/BetOptions.vue'
import NumberGrid from '../components/NumberGrid.vue'
import FooterAccount from '../components/FooterAccount.vue'
import BottomNav from '../components/BottomNav.vue'
import axios from 'axios'

const latestResult = ref(null)
const accountInfo = ref(null)

onMounted(async () => {
  try {
    const resultResponse = await axios.get('/api/latest-result')
    latestResult.value = resultResponse.data
    
    const accountResponse = await axios.get('/api/account-info')
    accountInfo.value = accountResponse.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>