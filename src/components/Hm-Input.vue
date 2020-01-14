<template>
  <div>
    <input @input="handleInput" :value="value" :type="type" :placeholder="placeholder" :class="[status]" class="border-b border-solid border-gray-600 bg-transparent w-full py-1 outline-none">
    <span class="text-12 error-msg w-full" v-show="showTips">
      {{errMsg}}
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      status: ''
    }
  },
  computed: {
    showTips () {
      return this.status === 'error'
    }
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    errMsg: {
      type: String,
      default: '',
      require: true
    },
    value: {
      type: String,
      default: ''
    },
    rules: {
      type: RegExp
    }
  },
  methods: {
    handleInput (e) {
      let { value } = e.target
      this.status = this.rules.test(value) ? 'success' : 'error'

      // 如果检测格式正确, 传输入的值, 格式错误, 传值为空
      if (this.status === 'success') {
        this.$emit('input', value)
      } else { this.$emit('input', '') }
    }
  }
}
</script>
