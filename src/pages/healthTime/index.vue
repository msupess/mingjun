<!--
 * @Author: chenming c1026287787@163.com
 * @Date: 2025-03-28 13:44:20
 * @LastEditors: chenming c1026287787@163.com
 * @LastEditTime: 2025-03-28 14:58:26
 * @Description: 中医养生时钟
-->


<template>
  <div
    class="clock-container"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <div class="time-section">
      <clock :isHiddenButon="true" />
      <bagua />
      <p class="shichen-tip">{{ shichenTip }}</p>
      <!-- 修改农历显示部分，分多行显示 -->
      <div class="lunar-info">
        <p class="lunar-time">{{ lunarYearMonthDay }}</p>
        <p class="lunar-detail">{{ lunarYearInfo }}</p>
      </div>
      
    </div>
    
    <!-- 添加向下滑动引导箭头，增加v-show控制显示隐藏 -->
    <div class="scroll-down-arrow" v-show="showScrollArrow" @click="scrollDown">
      <div class="arrow-down"></div>
      <div class="arrow-down"></div>
      <div class="arrow-down"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import clock from "@/components/clock.vue"
import bagua from "@/components/bagua.vue"
import { ref, onMounted, onUnmounted } from "vue";
import { Solar, Lunar } from 'lunar-typescript'; // 使用 lunar-ts 库处理农历

// 时辰养生提示字典
const shichenDict: { [key: string]: { time: string; tip: string } } = {
  子时: { time: "23:00-01:00", tip: "胆经运行，及时入睡养阳气" },
  丑时: { time: "01:00-03:00", tip: "肝经运行，深度睡眠助排毒" },
  寅时: { time: "03:00-05:00", tip: "肺经运行，保持温暖忌寒凉" },
  卯时: { time: "05:00-07:00", tip: "大肠经运行，起床饮水促排毒" },
  辰时: { time: "07:00-09:00", tip: "胃经运行，营养早餐要温食" },
  巳时: { time: "09:00-11:00", tip: "脾经运行，适当活动助运化" },
  午时: { time: "11:00-13:00", tip: "心经运行，小憩养神忌过劳" },
  未时: { time: "13:00-15:00", tip: "小肠经运行，补充水分助吸收" },
  申时: { time: "15:00-17:00", tip: "膀胱经运行，多喝温水促代谢" },
  酉时: { time: "17:00-19:00", tip: "肾经运行，少盐饮食护肾气" },
  戌时: { time: "19:00-21:00", tip: "心包经运行，放松心情宜休闲" },
  亥时: { time: "21:00-23:00", tip: "三焦经运行，准备入睡排烦恼" },
};

const lunarYearMonthDay = ref<string>("");
const lunarYearInfo = ref<string>("");
const shichenTip = ref<string>("");

const isDragging = ref<boolean>(false);
const dragStartX = ref<number>(0);
const dragStartY = ref<number>(0);
const initialX = ref<number>(window.innerWidth - 450);
const initialY = ref<number>(20);

const updateClock = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  // 农历时间
  const solar = Solar.fromYmd(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
  const lunar = solar.getLunar();
  
  // 提取农历信息并分行显示
  const fullLunarString = lunar.toFullString();
  
  // 提取年月日和年柱信息单独一行，其余信息另占一行。
  const yearMonthDayYearPillar = fullLunarString.match(/^(.*?年.*?月.*?日\s+.*?\)年)/);
  if (yearMonthDayYearPillar) {
    lunarYearMonthDay.value = `农历：${yearMonthDayYearPillar[1]}`;
    
    // 提取剩余信息
    const remainingInfo = fullLunarString.replace(yearMonthDayYearPillar[1], '').trim();
    lunarYearInfo.value = remainingInfo;
  } else {
    // 如果匹配失败，使用原来的分割方法
    const parts = fullLunarString.split(' ');
    lunarYearMonthDay.value = `农历：${parts[0]}`;
    if (parts.length > 1) {
      lunarYearInfo.value = parts.slice(1).join(' ');
    }
  }

  // 时辰提示
  const shichen = Object.entries(shichenDict).find(([name, { time }]) => {
    const [start, end] = time.split("-").map((t) => t.split(":").map(Number));
    const startTime = start[0] * 60 + start[1];
    const endTime = end[0] * 60 + end[1];
    const nowTime = currentHour * 60 + currentMinute;

    if (start[0] > end[0]) {
      // 跨天时辰
      return nowTime >= startTime || nowTime < endTime;
    }
    return nowTime >= startTime && nowTime < endTime;
  });

  if (shichen) {
    const [name, { time, tip }] = shichen;
    shichenTip.value = `${name}（${time}）：${tip}`;
  } else {
    shichenTip.value = "";
  }

  // 每秒更新
  setTimeout(updateClock, 1000);
};

// 拖动功能
const startDrag = (event: MouseEvent) => {
  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
};

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return;
  const newX = initialX.value + event.clientX - dragStartX.value;
  const newY = initialY.value + event.clientY - dragStartY.value;
  // document.querySelector(".clock-container")!.style.transform = `translate(${newX}px, ${newY}px)`;
};

const stopDrag = () => {
  isDragging.value = false;
};

// 添加滚动箭头控制变量
const showScrollArrow = ref(true);

// 滚动处理函数
const scrollDown = () => {
  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth'
  });
};

// 监听滚动事件
const handleScroll = () => {
  // 当滚动位置大于100px时隐藏箭头，回到顶部时显示
  showScrollArrow.value = window.scrollY < 100;
};

// 初始化
onMounted(() => {
  updateClock();
  // 添加滚动事件监听
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  // 移除滚动事件监听
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.clock-container {
  padding: 20px;
  background-color: #2f2f2f;
  color: #00ff00;
  font-family: "Microsoft YaHei", sans-serif;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  cursor: pointer;
  user-select: none;
}

.time-section {
  text-align: center;
}

.gregorian-time {
  font-size: 24px;
  margin-bottom: 10px;
}

.lunar-info {
  margin: 10px 0;
}

.lunar-time {
  font-size: 16px;
  color: #ffd700;
  margin-bottom: 5px;
}

.lunar-detail {
  font-size: 14px;
  color: #ffd700;
  margin-bottom: 10px;
  line-height: 1.4;
}

.shichen-tip {
  font-size: 18px;
  color: #ff6347;
  margin: 20px auto;
}

/* 添加向下滑动箭头样式 */
.scroll-down-arrow {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.arrow-down {
  width: 20px;
  height: 20px;
  border-right: 3px solid #00ff00;
  border-bottom: 3px solid #00ff00;
  transform: rotate(45deg);
  margin-top: -10px;
  animation: arrow-wave 1.5s infinite;
  opacity: 0;
}

.arrow-down:nth-child(1) {
  animation-delay: 0s;
}

.arrow-down:nth-child(2) {
  animation-delay: 0.3s;
}

.arrow-down:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes arrow-wave {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(-10px, -10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(10px, 10px);
  }
}

/* 适配移动端 */
@media screen and (max-width: 768px) {
  .arrow-down {
    width: 15px;
    height: 15px;
    border-width: 2px;
  }
}
</style>