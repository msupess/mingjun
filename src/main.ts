import { createSSRApp } from "vue";
import App from "./App.vue";
import './style.scss'
import naive from 'naive-ui'

export function createApp() {
  const app = createSSRApp(App);
  app.use(naive)
  return {
    app,
  };
}
