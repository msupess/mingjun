<!--
 * @Author: chenming c1026287787@163.com
 * @Date: 2025-03-28 15:17:17
 * @LastEditors: chenming c1026287787@163.com
 * @LastEditTime: 2025-03-28 15:19:02
 * @Description: 
-->


<template>
  <div 
    class="clock-container"

    @mousedown="startDrag"
    @mouseup="stopDrag"
  >
    <div class="time-section">
      <div class="gregorian">{{ state.gregorianTime }}</div>
      <div class="lunar">{{ state.lunarDate }}</div>
      <div class="shichen">{{ state.shichenTip }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { solar2lunar } from 'solarlunar'

// 时辰养生提示数据
const shichenData = [
  { name: '子时', time: '23:00-01:00', tip: '胆经运行，及时入睡养阳气' },
  { name: '丑时', time: '01:00-03:00', tip: '肝经运行，深度睡眠助排毒' },
  { name: '寅时', time: '03:00-05:00', tip: '肺经运行，保持温暖忌寒凉' },
  { name: '卯时', time: '05:00-07:00', tip: '大肠经运行，起床饮水促排毒' },
  { name: '辰时', time: '07:00-09:00', tip: '胃经运行，营养早餐要温食' },
  { name: '巳时', time: '09:00-11:00', tip: '脾经运行，适当活动助运化' },
  { name: '午时', time: '11:00-13:00', tip: '心经运行，小憩养神忌过劳' },
  { name: '未时', time: '13:00-15:00', tip: '小肠经运行，补充水分助吸收' },
  { name: '申时', time: '15:00-17:00', tip: '膀胱经运行，多喝温水促代谢' },
  { name: '酉时', time: '17:00-19:00', tip: '肾经运行，少盐饮食护肾气' },
  { name: '戌时', time: '19:00-21:00', tip: '心包经运行，放松心情宜休闲' },
  { name: '亥时', time: '21:00-23:00', tip: '三焦经运行，准备入睡排烦恼' }
]

// 农历月份
const lunarMonths = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
]

// 日期转中文
const dayToChinese = (day) => {
  const chineseDays = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ]
  return chineseDays[day - 1] || ''
}

const state = reactive({
  gregorianTime: '',
  lunarDate: '',
  shichenTip: ''
})

const position = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })

// 获取时辰提示
const getShichenTip = () => {
  const hour = new Date().getHours()
  for (const item of shichenData) {
    const [start, end] = item.time.split('-').map(t => parseInt(t.split(':')[0]))
    
    if (start > end) { // 处理跨天
      if (hour >= start || hour < end) {
        return `${item.name}（${item.time}）·${item.tip}`
      }
    } else if (hour >= start && hour < end) {
      return `${item.name}（${item.time}）·${item.tip}`
    }
  }
  return ''
}

// 更新农历日期
const updateLunarDate = () => {
  const now = new Date()
  const lunar = solar2lunar(now.getFullYear(), now.getMonth() + 1, now.getDate())
  
  let month = lunarMonths[lunar.lMonth - 1]
  if (lunar.isLeap) month = '闰' + month
  
  return `农历：${lunar.lYear}年${month}${dayToChinese(lunar.lDay)}`
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  
  state.gregorianTime = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-') + `\n${weekdays[now.getDay()]}`

  state.lunarDate = updateLunarDate()
  state.shichenTip = getShichenTip()
}

// 拖动处理
const startDrag = (e) => {
  isDragging.value = true
  dragStart.x = e.clientX - position.x
  dragStart.y = e.clientY - position.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  position.x = e.clientX - dragStart.x
  position.y = e.clientY - dragStart.y
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onMounted(() => {
  // 初始位置在右上角
  position.x = window.innerWidth - 400
  position.y = 20
  
  updateTime()
  const timer = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.clock-container {
  position: fixed;
  background: black;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,255,0,0.5);
  user-select: none;
  cursor: move;
  z-index: 9999;
}

.time-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gregorian {
  color: #00FF00;
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 24px;
  white-space: pre-wrap;
}

.lunar {
  color: #FFD700;
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 18px;
}

.shichen {
  color: #FF6347;
  font-family: 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  margin-top: 10px;
  max-width: 300px;
  white-space: normal;
}
</style>