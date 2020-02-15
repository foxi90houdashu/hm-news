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
    <hm-btn @click="login">登录</hm-btn>
    <span class="text-14">没有账号?去<router-link to="/register" class="text-teal-600 border-b border-dashed border-teal-600">注册</router-link></span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      pwd: ''
    }
  },
  methods: {
    async login () {
      let successStatus = true
      let allErrTag = document.querySelectorAll('.error-msg')

      allErrTag.forEach((item) => {
        if (item.style.display !== 'none') {
          successStatus = false
        }
      })

      if (successStatus && this.username && this.pwd) {
        const res = await this.$axios.post('/login', {
          username: this.username,
          password: this.pwd
        })

        if (res.data.statusCode === 401) {
          this.$toast.fail(res.data.message)
        } else {
          this.$toast.success('登录成功, 即将跳转至个人信息页面')

          // 处理用户token
          const { token, user } = res.data.data
          localStorage.setItem('token', token)
          localStorage.setItem('user_id', user.id)

          setTimeout(() => { this.$router.push('/userinfo') }, 600)
        }
      } else { this.$toast.fail('请输入正确的登录信息') }
    }
  }
}
</script>
