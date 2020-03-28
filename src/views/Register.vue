<template>
  <div class="px-2 text-center font-sans">
    <!-- 叉号 -->
    <div class="text-left pt-1">
      <span class="iconfont iconicon-test text-sm" @click="$router.push('/')"></span>
    </div>
    <!-- new图标 -->
    <div class="leading-tight">
      <span class="iconfont iconnew text-6xl icon-spe-color text-xs"></span>
    </div>

    <!-- 手机号输入框 -->
    <div class="text-18 mb-2 relative">
      <hm-input v-model="username" :rules="/^1\d{3,6}$/" placeholder="用户名 / 手机号" err-msg="用户名为1开头,4-7位数字"></hm-input>
    </div>

    <!-- 昵称输入框 -->
    <div class="text-18 mb-2 relative">
      <hm-input v-model="nickname" :rules="/^\w{3,9}$/" placeholder="昵称" err-msg="昵称为3-9位的非特殊字符"></hm-input>
    </div>

    <!-- 密码输入框 -->
    <div class="text-18 mb-6 relative">
      <hm-input v-model="pwd" type="password" placeholder="请输入密码" err-msg="密码格式为3~10位数字" :rules="/\d{3,10}/"></hm-input>
    </div>

    <!-- 注册按钮 -->
    <hm-btn @click="register">注册</hm-btn>
    <span class="text-14">已有账号?去<router-link to="/login" class="text-teal-600 border-b border-dashed border-teal-600">登录</router-link></span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      nickname: '',
      pwd: ''
    }
  },
  methods: {
    async register () {
      let successStatus = true
      let allErrTag = document.querySelectorAll('.error-msg')

      allErrTag.forEach((item) => {
        if (item.style.display !== 'none') {
          successStatus = false
        }
      })

      if (successStatus && this.username && this.nickname && this.pwd) {
        const res = await this.$axios.post('/register', {
          username: this.username,
          password: this.pwd,
          nickname: this.nickname
        })

        if (res.data.statusCode === 400) {
          this.$toast.fail('用户名已存在')
        } else {
          this.$toast.success('注册成功, 2秒后跳转至登录页面')
          setTimeout(() => {
            this.$router.push({
              name: 'hm-login',
              params: { username: this.username }
            })
          }, 2000)
        }
      } else { this.$toast.fail('请输入正确的注册信息') }
    }
  }
}
</script>
