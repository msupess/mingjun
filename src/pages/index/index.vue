<template>
  <div class="container">
    <!-- <div style="text-align:center;font-size:40px;color:red;letter-spacing:14px;">明均时钟</div> -->
    <div class="date-info">{{ displayDate }}</div>
    <div class="clock" id="clock" v-html="displayTime"></div>
    <div class="weather-info">
      <template v-if="weatherData">
        <div class="current-weather">
          {{locationInfo.name}}今天
          <span>{{ weatherData.temp }}°C</span>
          <span>{{ weatherData.text }}</span>
        </div>
      </template>
      <div v-else>加载天气中...</div>
    </div>
    <div class="forecast-container" v-if="forecastData.length">
      <div v-for="(item, index) in forecastData" :key="index" class="forecast-item">
        <div>{{ item.date }}</div>
        <div>{{ item.tempMin }}°C ~ {{ item.tempMax }}°C</div>
        <div>{{ item.textDay }}</div>
      </div>
    </div>
    <div class="button-container">
      <button class="toggle-button" @click="toggleSeconds">{{ showSeconds ? '隐藏秒数' : '显示秒数' }}</button>
      <button class="toggle-button" @click="toggleFullscreen">全屏切换</button>
    </div>
    <div class="money-container" ref="moneyContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import axios from 'axios'

// 替换成您的和风天气 API Key
const WEATHER_API_KEY = 'a150aca091d84cc68690ca3781e6a9a6'
const LOCATION = ref('') // 所在城市的 ID

const showSeconds = ref(true)
const timer = ref(null)
const currentTime = ref(new Date())
const weatherData = ref(null)
const forecastData = ref([])
let locationInfo = reactive({})

const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

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

const getCityId = async (cityName: string) => {
  try {
    const response = await axios.get(
      `https://geoapi.qweather.com/v2/city/lookup?location=${cityName}&key=${WEATHER_API_KEY}`
    )
    console.log('getCityId-response', response);
    
    if (response.data.code === '200' && response.data.location?.length > 0) {
      console.log('999')
      LOCATION.value = response.data.location[0].id
      locationInfo = response.data.location[0]
      return response.data.location[0].id
    }
  } catch (error) {
    console.error('获取城市ID失败:', error)
  }
  return '101210101' // 默认返回杭州
}

const fetchWeather = async () => {
  try {
    // 获取实时天气
    const nowResponse = await axios.get(
      `https://devapi.qweather.com/v7/weather/now?location=${LOCATION.value}&key=${WEATHER_API_KEY}`
    )
    if (nowResponse.data.code === '200') {
      weatherData.value = {
        temp: nowResponse.data.now.temp,
        text: nowResponse.data.now.text
      }
    }

    // 获取天气预报
    const forecastResponse = await axios.get(
      `https://devapi.qweather.com/v7/weather/7d?location=${LOCATION.value}&key=${WEATHER_API_KEY}`
    )
    if (forecastResponse.data.code === '200') {
      forecastData.value = forecastResponse.data.daily.map(day => ({
        date: day.fxDate,
        tempMin: day.tempMin,
        tempMax: day.tempMax,
        textDay: day.textDay
      }))
    }
  } catch (error) {
    console.error('获取天气信息失败:', error)
  }
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

// 修改撒钱相关的方法
const moneyContainer = ref(null)
const moneyTimer = ref(null)

const createMoneyElement = () => {
  const money = document.createElement('div')
  money.className = 'money'
  const moneySymbols = ['💰', '💵', '💴', '💶', '💷']
  money.innerHTML = moneySymbols[Math.floor(Math.random() * moneySymbols.length)]
  
  // 随机起始位置
  const startLeft = Math.random() * 100
  money.style.left = `${startLeft}vw`
  
  // 随机大小
  money.style.fontSize = Math.random() * 15 + 15 + 'px'
  
  // 随机动画持续时间
  money.style.animationDuration = Math.random() * 3 + 4 + 's'
  
  // 随机摆动幅度
  const swayAmount = Math.random() * 100 + 50
  money.style.setProperty('--sway-amount', `${swayAmount}px`)
  
  // 随机延迟开始时间
  money.style.animationDelay = `${Math.random() * 2}s`
  
  money.addEventListener('animationend', () => {
    money.remove()
  })
  return money
}

const autoMakeItRain = () => {
  if (!moneyContainer.value) return
  const money = createMoneyElement()
  moneyContainer.value.appendChild(money)
}

onMounted(async () => {
  await getCityId('杭州')
  updateClock()
  fetchWeather()
  // 每小时更新一次天气
  setInterval(fetchWeather, 3600000)
  // 随机间隔自动撒钱
  const startAutoRain = () => {
    autoMakeItRain()
    const nextInterval = Math.random() * 2000 + 1000 // 1-3秒随机间隔
    moneyTimer.value = setTimeout(startAutoRain, nextInterval)
  }
  startAutoRain()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (moneyTimer.value) {
    clearTimeout(moneyTimer.value)
  }
})

// 删除原来的 makeItRain 方法
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

.date-info {
  color: #fff;
  font-size: 78px;
  margin-bottom: 20px;
}

.weather-info {
  color: #fff;
  font-size: 24px;
  margin: 20px 0;
}

.current-weather {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.forecast-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding: 10px;
  max-width: 100%;
}

.forecast-item {
  background-color: #222;
  padding: 15px;
  border-radius: 10px;
  color: #fff;
  text-align: center;
  min-width: 120px;
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

.money-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
}

.money {
  position: absolute;
  top: -50px;
  font-size: 30px;
  animation: snowfall linear forwards;
  opacity: 0.8;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  will-change: transform;
}

@keyframes snowfall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(var(--sway-amount));
  }
  100% {
    transform: translateY(105vh) translateX(calc(var(--sway-amount) * -0.5));
    opacity: 0.8;
  }
}

// 修改按钮容器样式，确保按钮在最上层
.button-container {
  position: relative;
  z-index: 1001;
}
</style>