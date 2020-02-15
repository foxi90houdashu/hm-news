import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'lib-flexible'
import moment from 'moment'
// 引入css
import '@/css/base.css'
import '@/css/tailwind.css'
// 引入vant
import { Button, Toast, Dialog, Field, RadioGroup, Radio, Cell, CellGroup, Uploader, List, Tab, Tabs, PullRefresh } from 'vant'
// 引入自己写的组件
import HmInput from '@/components/Hm-Input'
import HmBtn from '@/components/Hm-Btn'
import HmNav from '@/components/Hm-UserNav.vue'
import HmHeader from '@/components/Hm-Header.vue'

// 注册vant组件
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(PullRefresh)
// 注册全局组件(input框, 按钮, 用户信息导航)
Vue.component('hm-input', HmInput)
Vue.component('hm-btn', HmBtn)
Vue.component('hm-usernav', HmNav)
Vue.component('hm-header', HmHeader)

// axios挂载到vue的原型上
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// axios请求及响应拦截
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  config.headers.Authorization = !token ? '' : token
  return config
})

// 时间过滤
Vue.filter('time', function (input, format = 'YYYY-MM-DD') {
  return moment(input).format(format)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
