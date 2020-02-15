import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UserInfo from '@/views/UserInfo.vue'
import EditInfo from '@/views/EditInfo.vue'
import Follow from '@/views/Follow.vue'
import myComments from '@/views/myComments.vue'
import myFavorite from '@/views/MyFavorite.vue'
import home from '@/views/Home.vue'
import postDetail from '@/views/PostDetail.vue'
import tabManage from '@/views/tabManage.vue'
import search from '@/views/Search.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/search', name: 'search', component: search },
  { path: '/tabManage', name: 'tabManage', component: tabManage },
  { path: '/postDetail/:id', name: 'hm-postDetail', component: postDetail },
  { path: '/myFavorite', name: 'hm-myFavorite', component: myFavorite },
  { path: '/myComments', name: 'hm-myComments', component: myComments },
  { path: '/follow', name: 'hm-follow', component: Follow },
  { path: '/editinfo', name: 'hm-editinfo', component: EditInfo },
  { path: '/userinfo', name: 'hm-userinfo', component: UserInfo },
  { path: '/register', name: 'hm-register', component: Register },
  { path: '/login', name: 'hm-login', component: Login },
  { path: '/', name: 'hm-home', component: home }
]

const router = new VueRouter({
  routes
})

const AuthUrls = [
  '/userinfo',
  '/editinfo',
  '/follow',
  '/myComments',
  '/myFavorite'
]
router.beforeEach(function (to, from, next) {
  // 判断用户是否登录
  const token = localStorage.getItem('token')

  if (AuthUrls.includes(to.path)) {
    if (token) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
