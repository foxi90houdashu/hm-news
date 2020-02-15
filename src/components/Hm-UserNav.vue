<template>
  <div class="user-nav h-6 px-2 flex justify-between items-center text-14 border-b border-gray-300 text-gray-500" @click="handleClick">
    <p class="flex-1 flex justify-between">
      <span class="text-gray-700">{{navTitle}}</span>
      <span>{{navDesc}}</span>
    </p>
    <i class="iconfont iconjiantou1 pl-1"></i>
  </div>
</template>

<script>
export default {
  props: {
    navTitle: {
      required: true,
      type: String
    },
    navDesc: {
      type: String
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
