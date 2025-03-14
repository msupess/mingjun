import { createSSRApp } from "vue";
import App from "./App.vue";
import './style.scss'
import naive from 'naive-ui' // UI框架网站：https://www.naiveui.com

// 腾讯部署网站：https://www.tencentcloud.com/

export function createApp() {
  const app = createSSRApp(App);
  app.use(naive)
  return {
    app,
  };
}
