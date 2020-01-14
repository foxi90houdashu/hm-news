import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
// import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'hm-login',
    component: Login
  },
  {
    path: '/',
    name: 'hm-main',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes
})

export default router
