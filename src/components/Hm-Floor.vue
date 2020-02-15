<template>
  <div>
    <!-- 递归渲染父级评论 -->
    <hm-floor @reply="reply" :index="index-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>

    <div class="p-1 border-l border-b border-r border-gray-400">
      <!-- 昵称 & 时间 & 回复 -->
      <div class="pb-1">
        <span class="pr-1 text-14">{{index}}楼 {{comment.user.nickname}}</span>
        <span class="text-gray-500 text-12">{{comment.create_date | time('YYYY-MM-DD HH:mm')}}</span>
        <span @click="reply(comment.id)" class="text-gray-600 float-right text-12">回复</span>
      </div>

      <!-- 父级评论内容 -->
      <p class="text-14">{{comment.content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hm-floor',
  props: {
    comment: Object,
    index: Number
  },
  methods: {
    reply (id) { this.$emit('reply', id) }
  }
}
</script>
