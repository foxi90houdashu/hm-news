<template>
  <div class="px-1 pt-1 border-b border-gray-300">
    <!-- 评论基本信息 & 回复 -->
    <div class="flex py-1 border-gray-400" :class="{'border-b': comment.parent}">
      <!-- 用户头像 -->
      <img :src="$axios.defaults.baseURL + comment.user.head_img" alt="" class="w-4 h-4 rounded-full">
      <div class="flex-1 pl-1" style="padding-bottom:4px">
        <!-- 昵称 & 时间 -->
        <p class="text-14">{{comment.user.nickname}}</p>
        <p class="text-gray-500 text-12">{{comment.create_date | time('YYYY-MM-DD HH:mm')}}</p>
      </div>
      <!-- 回复按钮 -->
      <span class="text-gray-600 text-12" @click="reply(comment.id)">回复</span>
    </div>

    <!-- 评论楼层 -->
    <hm-floor @reply="reply" :index="index" v-if="comment.parent" :comment="comment.parent"></hm-floor>

    <!-- 评论内容 -->
    <p class="py-1 text-14">{{comment.content}}</p>
  </div>
</template>

<script>
import HmFloor from '@/components/Hm-Floor'
export default {
  props: {
    comment: Object
  },
  components: {
    HmFloor
  },
  data () {
    return {
      index: this.getCommentLength(0, this.comment)
    }
  },
  methods: {
    // 这个方法用于计算comment数据中parent的层级
    getCommentLength (num, comment) {
      // 如果传递进来的commnet有parent数据
      if (comment.parent) {
        return this.getCommentLength(num + 1, comment.parent)
      }
      return num
    },

    // 触发父组件回复功能
    reply (id) { this.$emit('reply', id) }
  }
}
</script>
