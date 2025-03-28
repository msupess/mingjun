<!--
 * @Author: chenming c1026287787@163.com
 * @Date: 2025-03-12 10:09:29
 * @LastEditors: chenming c1026287787@163.com
 * @LastEditTime: 2025-03-14 17:09:51
 * @Description: 子宫肌瘤
-->
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
  <n-flex vertical style="padding: 14px;">
      <a href="https://www.zhihu.com/question/14671461774" @click="gotoCase('')" target="_blank">1、26 岁女子爱生闷气，子宫长出 8 个肌瘤，最大的比拳头还大，为什么会这样？生气真能「气出肌瘤」吗？</a>
  </n-flex>
</template>

<script setup lang="ts">

const gotoCase = (url: string) => {
  if(!url) {
    return;
  }
  uni.navigateTo({
    url
  });
}
</script>

<style scoped lang="scss">


</style>