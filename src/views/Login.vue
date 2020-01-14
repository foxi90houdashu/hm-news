<template>
  <div class="px-2 text-center font-sans">
    <!-- 叉号 -->
    <div class="text-left pt-1">
      <span class="iconfont iconicon-test text-sm"></span>
    </div>
    <!-- new图标 -->
    <div class="leading-tight">
      <span class="iconfont iconnew text-6xl icon-spe-color text-xs"></span>
    </div>

    <!-- 手机号输入框 -->
    <div class="text-18 mb-2 relative">
      <hm-input v-model="username" :rules="/^1\d{3,6}$/" placeholder="用户名 / 手机号" err-msg="错误的用户名"></hm-input>
    </div>

    <!-- 密码输入框 -->
    <div class="text-18 mb-6 relative">
      <hm-input v-model="pwd" type="password" placeholder="请输入密码" err-msg="错误的密码" :rules="/\d{3,10}/"></hm-input>
    </div>

    <!-- 登录按钮 -->
    <hm-btn @click="login"></hm-btn>
  </div>
</template>

<script>
import HmInput from '@/components/Hm-Input'
import HmBtn from '@/components/Hm-Btn'
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      pwd: ''
    }
  },
  components: {
    'hm-input': HmInput,
    'hm-btn': HmBtn
  },
  methods: {
    async login () {
      if (!(this.username && this.pwd)) { return console.log('wrong axios') }

      const res = await axios.post('http://localhost:3000/login', {
        username: this.username,
        password: this.password
      })

      res.data.statusCode === 401 ? alert('登录失败') : alert('登录成功')
    }
  }
}
</script>
