<template>
  <div class="money-rain">
    <div
      v-for="(item, index) in moneyItems"
      :key="item.id"
      class="money-item"
      :style="{ 
        left: item.left + 'px',
        animationDelay: item.delay + 's',
        fontSize: item.size + 'px',
      }"
    >
      {{ item.symbol }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "MoneyRain",
  setup() {
    const moneyItems = ref([]);
    let timer = null;
    let itemId = 0;

    const symbols = ["💰", "💵", "💴", "💶", "💷"];

    const addItem = () => {
      const screenWidth = window.innerWidth;
      
      const newItem = {
        id: itemId++,
        left: Math.random() * screenWidth,
        delay: Math.random() * 3, // 增加延迟时间
        size: Math.random() * 15 + 20,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      };
    
      moneyItems.value.push(newItem);
    
      // 增加到8秒后移除元素
      setTimeout(() => {
        moneyItems.value = moneyItems.value.filter(item => item.id !== newItem.id);
      }, 8000);
    
      // 控制最大数量
      if (moneyItems.value.length > 30) {
        moneyItems.value = moneyItems.value.slice(-30);
      }
    };

    const startDrop = () => {
      const createItems = () => {
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          addItem();
        }
      };
    
      createItems();
      timer = setInterval(createItems, 500); // 增加生成间隔到500ms
    };

    const stopDrop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    onMounted(startDrop);
    onUnmounted(stopDrop);

    return {
      moneyItems,
    };
  },
};
</script>

<style scoped>
.money-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
  opacity: 0.9;
}

.money-item {
  position: absolute;
  top: -50px;
  user-select: none;
  animation: fall 8s linear forwards;
  will-change: transform;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 50px)) rotate(360deg);
    opacity: 0;
  }
}
</style>