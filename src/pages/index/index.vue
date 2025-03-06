<template>
  <div class="container">
    <div style="text-align:center;font-size:40px;color:red;letter-spacing:14px;">明均时钟</div>
    <div class="clock" id="clock" v-html="displayTime"></div>
    <div class="button-container">
      <button class="toggle-button" @click="toggleSeconds">{{ showSeconds ? '隐藏秒数' : '显示秒数' }}</button>
      <button class="toggle-button" @click="toggleFullscreen">全屏切换</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const showSeconds = ref(true)
const timer = ref(null)
const currentTime = ref(new Date())

const displayTime = computed(() => {
  const hours = String(currentTime.value.getHours()).padStart(2, '0')
  const minutes = String(currentTime.value.getMinutes()).padStart(2, '0')
  const seconds = String(currentTime.value.getSeconds()).padStart(2, '0')

  return showSeconds.value
      ? `${hours}<span class="colon">:</span>${minutes}<span class="colon">:</span>${seconds}`
      : `${hours}<span class="colon">:</span>${minutes}`
})

const updateClock = () => {
  timer.value = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
}

const toggleSeconds = () => {
  showSeconds.value = !showSeconds.value
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else if (document.exitFullscreen) {
    document.exitFullscreen()
  }
}

onMounted(() => {
  updateClock()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #333;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  background-color: #333;
  font-family: Arial, sans-serif;
}

.clock {
  background-color: #222;
  padding: 80px 100px;
  border-radius: 20px;
  color: #fff;
  font-size: 160px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}

.colon {
  opacity: 1;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.button-container {
  display: flex;
  gap: 30px;
}

.toggle-button {
  padding: 20px;
  font-size: 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  -webkit-tap-highlight-color: transparent;
}

.toggle-button:hover {
  background-color: #45a049;
}

@media screen and (max-width: 768px) {
  .clock {
    padding: 40px 50px;
    font-size: 80px;
    margin-bottom: 20px;
  }

  .toggle-button {
    padding: 12px;
    font-size: 14px;
  }

  .button-container {
    gap: 15px;
  }
}

@media screen and (max-width: 480px) {
  .clock {
    padding: 30px 40px;
    font-size: 60px;
    margin-bottom: 15px;
  }

  .toggle-button {
    padding: 12px 24px;
    font-size: 16px;
  }

  .button-container {
    gap: 10px;
    flex-direction: column;
  }
}
</style>