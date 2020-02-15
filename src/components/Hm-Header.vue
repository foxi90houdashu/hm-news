<template>
  <div class="hm-header flex justify-between text-16 py-1 border-t border-gray-400 px-2">
    <div class="left w-6" @click="$router.back()">
      <i class="iconfont iconjiantou2 text-14"></i>
    </div>
    <div class="center font-bold"><slot></slot></div>
    <div class="right w-6"></div>
  </div>
</template>

<script>
export default {}
</script>
