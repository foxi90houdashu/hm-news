<template>
  <div>
    <hm-header>我的跟帖</hm-header>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getCommentList(pageIndex++)"
      :immediate-check="false"
      :offset="50"
    >
      <div class="px-2 border-b border-gray-400 text-14" v-for="item in commentList" :key="item.id">
        <!-- 评论时间 -->
        <p class="time py-2 text-gray-500">{{ item.create_data | time('YYYY-MM-DD HH:mm') }}</p>

        <!-- 父级评论 -->
        <div v-if="item.parent" class="parent-content py-2 px-1 bg-gray-200 text-gray-600">
          <span style="font-size: 13px">回复: {{ item.parent.user.nickname }}</span>
          <p>{{ item.parent.content }}</p>
        </div>

        <!-- 评论内容 -->
        <p class="content pt-2 text-gray-800">{{ item.content }}</p>

        <!-- 评论原文 -->
        <div class="origin py-2 text-gray-500 flex">
          <span class="one-txt-cut flex-1 pr-8">原文：{{ item.post.title }}</span>
          <span class="iconfont iconjiantou1"></span>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commentList: [],
      pageIndex: 1,
      pageSize: 6,
      loading: false,
      finished: false
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    // 获取评论列表
    async getCommentList () {
      console.log('加载数据')
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })

      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = [...this.commentList, ...data]
        // 关闭vant加载开关, 下次拉到最底会再加载数据
        this.loading = false
        // 关于最后一页的判断
        data.length < this.pageSize ? this.finished = true : console.log('')
      }
    }
  }
}
</script>
