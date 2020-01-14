<template>
  <div>
    <div @click="login" class="login-btn h-6 text-gray-100 rounded-full text-18 block">登录</div>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      this.$emit('click')
    }
  }
}
</script>
