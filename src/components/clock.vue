<template>
  <div style="background-color: #333;padding-top: 40px; box-sizing: border-box" :style="{ height: isHiddenButon ? '100vh' : 'unset' }">
    <div style="overflow: hidden; margin: 0 40px;">
      <div class="date-info">{{ displayDate }}</div>
      <div class="clock" id="clock" v-html="displayTime"></div>
      <template v-if="!isHiddenButon">
        <div style="display: flex; justify-content: center">
          <n-space>
            <n-button type="warning"  round @click="toggleSeconds">{{ showSeconds ? '隐藏秒数' : '显示秒数' }}</n-button>
            <n-button round type="error" @click="toggleFullscreen">全屏切换</n-button>
          </n-space>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isHiddenButon: String
});

const timer = ref(null)
const currentTime = ref(new Date())
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const showSeconds = ref(true)

const displayDate = computed(() => {
  const date = currentTime.value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDay = weekDays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekDay}`
})

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

onMounted(async () => {
  updateClock()
  if(props.isHiddenButon) {
    document.documentElement.requestFullscreen()
  }
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

</script>

<style scoped lang="scss">
.date-info {
  color: #fff;
  font-size: 78px;
  margin-bottom: 20px;
  text-align: center;
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



@media screen and (max-width: 768px) {
  .date-info {
    font-size: 28px;
  }

  .weather-info {
    font-size: 18px;
  }

  .forecast-item {
    min-width: 110px;
    padding: 10px;
  }
}

@media screen and (max-width: 480px) {
  .date-info {
    font-size: 26px;
  }

  .weather-info {
    font-size: 16px;
  }

  .forecast-container {
    gap: 10px;
  }

  .forecast-item {
    min-width: 96px;
    padding: 8px;
    font-size: 14px;
  }
}

</style>