import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import './assets/fonts/iconfont.css'
import axios from 'axios'

const app = createApp(App)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
app.config.globalProperties.$axios = axios
app.use(router)
app.use(ElementPlus)

app.mount('#app')
