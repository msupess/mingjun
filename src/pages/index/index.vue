<template>
  <!-- 钱掉落的组件  -->
  <moneyDown />
  <div class="container">
    <!-- <div style="text-align:center;font-size:40px;color:red;letter-spacing:14px;">明均时钟</div> -->
    <!-- 添加考试倒计时 -->
    <n-space vertical>
      <div class="exam-countdown">距离<span style="color: greenyellow">2025年初级会计考试</span>还有 <span style="color: yellow">{{ examCountdown }}</span> 天</div>
      <div class="exam-countdown">距离<span style="color: greenyellow">2025年系统架构设计师</span>还有 <span style="color: yellow">{{ examCountdown2 }}</span> 天</div>
    </n-space>
    <clock />
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
        <div>{{getDayOfWeek(item.date)}} {{ item.textDay }}</div>
      </div>
    </div>
   
    <div class="money-container" ref="moneyContainer"></div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import axios from 'axios'
import moneyDown from "@/components/moneyDown.vue"
import clock from "@/components/clock.vue"

const  getDayOfWeek = (dateString: string) => {
  // 创建一个 Date 对象
  const date = new Date(dateString);

  // 获取星期几，其中 0 表示星期日，1 表示星期一，以此类推
  const dayOfWeek = date.getDay();

  // 将数字转换为星期几的名称
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return days[dayOfWeek];
}

// 使用示例
const dateString = "2025-03-07";
const dayOfWeek = getDayOfWeek(dateString);
console.log(dayOfWeek); // 输出: 星期五
// 替换成您的和风天气 API Key
const WEATHER_API_KEY = 'a150aca091d84cc68690ca3781e6a9a6'
const LOCATION = ref('') // 所在城市的 ID

const weatherData = ref(null)
const forecastData = ref([])
let locationInfo = reactive({})

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

// 修改撒钱相关的方法
const moneyContainer = ref(null)
const moneyTimer = ref(null)

const createMoneyElement = () => {
  const money = document.createElement('div')
  money.className = 'money'
  const moneySymbols = ['💰', '💵', '💴', '💶', '💷']
  money.innerHTML = moneySymbols[Math.floor(Math.random() * moneySymbols.length)]
  
  // 随机起始位置（横向）
  const randomX = Math.random() * window.innerWidth
  money.style.left = `${randomX}px`
  
  // 随机大小
  money.style.fontSize = Math.random() * 15 + 15 + 'px'
  
  // 随机动画持续时间
  money.style.animationDuration = Math.random() * 3 + 4 + 's'
  
  // 随机摆动方向和幅度
  const swayDirection = Math.random() > 0.5 ? 1 : -1
  const swayAmount = (Math.random() * 100 + 50) * swayDirection
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
  // 同时创建多个钱币，增加随机性
  const count = Math.floor(Math.random() * 3) + 1 // 随机1-3个
  for (let i = 0; i < count; i++) {
    const money = createMoneyElement()
    moneyContainer.value.appendChild(money)
  }
}

onMounted(async () => {
  await getCityId('杭州')
  fetchWeather()
  // 每小时更新一次天气
  setInterval(fetchWeather, 3600000)
  // 随机间隔自动撒钱
  const startAutoRain = () => {
    autoMakeItRain()
    const nextInterval = Math.random() * 2000 + 1000 // 1-3秒随机间隔
    moneyTimer.value = setTimeout(startAutoRain, nextInterval)
  }
  // startAutoRain()
})

onUnmounted(() => {
  if (moneyTimer.value) {
    clearTimeout(moneyTimer.value)
  }
})

// 添加考试倒计时计算
const examDate = new Date('2025-05-17')
const examCountdown = computed(() => {
  const today = new Date()
  const diffTime = examDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// 添加考试倒计时计算
const examDate2 = new Date('2025-05-24')
const examCountdown2 = computed(() => {
  const today = new Date()
  const diffTime = examDate2.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
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
  transform-origin: center;
}

@keyframes snowfall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(var(--sway-amount)) rotate(180deg);
  }
  100% {
    transform: translateY(105vh) translateX(calc(var(--sway-amount) * -0.8)) rotate(360deg);
    opacity: 0.8;
  }
}

// 修改按钮容器样式，确保按钮在最上层
.button-container {
  position: relative;
  z-index: 1001;
}

.exam-countdown {
  color: #ff6b6b;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
}

@media screen and (max-width: 768px) {
  .exam-countdown {
    font-size: 24px;
  }
}

@media screen and (max-width: 480px) {
  .exam-countdown {
    font-size: 20px;
  }
}
</style>