<template>
  <!-- Crisp Chat Component -->
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isCrispLoaded = ref(false)
const isCrispVisible = ref(false)

// Function to load Crisp script and return a promise
const loadCrispScript = () => {
  return new Promise((resolve) => {
    if (isCrispLoaded.value) {
      resolve()
      return
    }
    
    window.$crisp = []
    window.CRISP_WEBSITE_ID = "2e9f022b-b3d4-4906-95f3-3056b4d2a2f3"
    
    const script = document.createElement('script')
    script.src = "https://client.crisp.chat/l.js"
    script.async = true
    document.head.appendChild(script)
    
    script.onload = () => {
      isCrispLoaded.value = true
      // Wait a bit for Crisp to initialize fully
      setTimeout(() => {
        resolve()
      }, 500)
    }
  })
}

// Function to toggle Crisp visibility
const toggleCrispVisibility = async () => {
  try {
    // Load script if not loaded yet
    await loadCrispScript()
    
    // Toggle visibility
    if (isCrispVisible.value) {
      window.$crisp.push(["do", "chat:hide"])
    } else {
      window.$crisp.push(["do", "chat:show"])
    }
    
    isCrispVisible.value = !isCrispVisible.value
    
    // Log for debugging
    console.log('Crisp visibility toggled:', isCrispVisible.value)
  } catch (error) {
    console.error('Error toggling Crisp chat:', error)
  }
}

// Expose the toggle function to be used by parent components
defineExpose({
  toggleCrispVisibility
})

onMounted(() => {
  // We don't load Crisp automatically, only when the user clicks the chat button
})

onUnmounted(() => {
  // Clean up if needed
  if (isCrispLoaded.value) {
    window.$crisp.push(["do", "chat:hide"])
  }
})
</script>