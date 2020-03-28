<template>
  <div class="hm-post" @click="$router.push(`/postDetail/${post.id}`)">
    <!-- 视频类: type=2 -->
    <div class="video-post p-1 border-b border-gray-300" v-if="post.type === 2">
      <p class="text-16 w-full pb-1 leading-tight">{{post.title}}</p>
      <div class="relative">
        <img :src="$fixUrl(post.cover[0].url)" alt="" class="object-cover w-full h-18">
        <i class="iconfont iconshipin absolute top50 left50 translateXY text-white rounded-full text-xl text-center w-6 h-6 leading-6" style="background-color: rgba(0, 0, 0, .3)"></i>
      </div>
      <div class="text-gray-600 text-14 pt-1">
        <span class="pr-1">{{post.user.nickname}}</span>
        <span>{{post.comment_length}}</span>
      </div>
    </div>

    <!-- 单张图片结构, 图片数量 <3 -->
    <div class="single-img p-1 flex border-b border-gray-300" v-else-if="post.cover.length < 3">
      <div class="h-8 flex flex-1 flex-wrap content-between pr-1">
        <!-- 标题 -->
        <p class="text-16 w-full leading-tight">{{post.title}}</p>
        <!-- 昵称与跟帖数量 -->
        <div class="text-gray-600 text-14">
          <span class="pr-1">{{post.user.nickname}}</span>
          <span>{{post.comment_length}}跟帖</span>
        </div>
      </div>
      <!-- 图片 -->
      <img :src="$fixUrl(post.cover[0].url)" alt="" class="h-8 object-cover" style="width: 120px">
    </div>

    <!-- 多张图片结构 -->
    <div class="multi-img p-1 border-b border-gray-300" v-else>
      <p class="w-full pb-1 text-16 leading-tight">{{post.title}}</p>
      <!-- 三张图片 -->
      <div class="flex imgs">
        <img class="h-8 object-cover" v-for="item in post.cover" :key="item.id" :src="$fixUrl(item.url)" alt="">
      </div>
      <!-- 昵称与跟帖数量 -->
      <div class="text-gray-600 text-14">
        <span class="pr-1">{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  }
}
</script>

<style>
  .multi-img .imgs{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2px
  }

</style>
