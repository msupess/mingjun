// 子宫肌瘤
<template>
  <n-watermark
      content="喜喜家"
      cross
      fullscreen
      selectable
      :font-size="16"
      :line-height="16"
      :width="192"
      :height="128"
      :x-offset="12"
      :y-offset="28"
      :rotate="-15"
  >
  </n-watermark>
  <img :src="loadingImg" />
  <n-space justify="space-around">
    <n-button round type="error" @click="gotoCase">案例</n-button>
  </n-space>
</template>

<script setup lang="ts">
import loadingImg from "@/static/images/loading.gif"

const gotoCase = () => {
  uni.navigateTo({
    url: '/pages/myomaOfUterus/case/index'
  });
}

</script>

<style scoped lang="scss">

</style>