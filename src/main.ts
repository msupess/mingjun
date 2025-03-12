import { createSSRApp } from "vue";
import App from "./App.vue";
import './style.scss'
import naive from 'naive-ui'

// 腾讯部署网站：https://www.tencentcloud.com/

export function createApp() {
  const app = createSSRApp(App);
  app.use(naive)
  return {
    app,
  };
}
