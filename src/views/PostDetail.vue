<template>
  <div class="post-detail pb-4">
    <!-- 头部 -->
    <div class="flex items-center h-5 px-1">
      <i class="iconfont iconjiantou2" @click="$router.back()"></i>
      <i class="iconfont iconnew text-2xl flex-1 h-5 leading-5"></i>

      <!-- 关注按钮 -->
      <button class="w-8 h-3 text-14 border-gray-400 border rounded-full " v-if="detail.has_follow" @click="toggleFollow('unfollow')">已关注</button>
      <button class="w-8 h-3 text-14 bg-pure-red rounded-full text-white" v-else @click="toggleFollow('follow')">关注</button>
    </div>

    <!-- 新闻详情 (包括视频) -->
    <div class="main px-1">
      <!-- 新闻标题 -->
      <h1 class="text-18 font-bold">{{detail.title}}</h1>

      <!-- 用户名称与发布时间 -->
      <div class="text-999">
        <span class="pr-1">{{detail.user.nickname}}</span>
        <span>{{detail.create_date | time}}</span>
      </div>

      <!-- 视频类的详情 -->
      <div class="video" v-if="detail.type === 2 && detail.content.startsWith('http')">
        <video :src="detail.content" controls></video>
      </div>

      <!-- 不是视频类型, 直接渲染文章内容 -->
      <div class="pt-2 text-14 leading-loose" v-else v-html="detail.content"></div>
    </div>

    <!-- 点赞和分享 -->
    <div class="flex justify-around p-2 border-gray-300 border-b-4">
      <!-- 根据用户是否点赞来判断是否有like的类名 -->
      <div class="px-1 w-8 h-3 flex items-center justify-around border-gray-700 border rounded-full" @click="toggleLike">
        <i class="iconfont icondianzan text-18" :class="{'text-pure-red': detail.has_like}"></i>
        <span class="text-14">{{detail.like_length}}</span>
      </div>

      <!-- 微信分享 -->
      <div class="px-1 w-8 h-3 flex items-center justify-around border-gray-700 border rounded-full">
        <i class="iconfont iconweixin text-pure-green text-18"></i>
        <span class="text-14">微信</span>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="post-commnet">
      <h2 class="text-20 text-center pt-2 pb-1">精彩跟帖</h2>
      <!-- 评论组件 -->
      <hm-comment
        v-for="item in commentList"
        :key="item.id"
        :comment="item"
        @reply="reply"
      ></hm-comment>

      <p v-if="!commentList.length" class="text-center text-14 text-gray-500 pt-1">暂无跟帖,抢占沙发</p>
    </div>

    <!-- 底部区域 -->
    <div class="p-1 fixed w-full bottom-0 border-gray-300 border-t" style="max-width: 750px;min-width: 320px;background-color: #f8f8f8;">
      <!-- 输入框与操作图标 -->
      <div v-show="isFocus" class="flex justify-between items-center">
        <input @focus="showTextarea(isFocus=0)" class="flex-1 h-3 text-14 bg-gray-400 pl-2 rounded-full placeholder-gray-700" type="text" placeholder="写跟帖">

        <!-- 底部图标区域 -->
        <div class="flex">
          <div class="icon-comment relative">
            <i class="iconfont iconpinglun- pl-3 text-24"></i>
            <!-- 评论个数 -->
            <span class="text-14 text-white absolute right-0 top-0 translateX50 rounded-full bg-pure-red" style="padding: 0 4px">{{detail.comment_length}}</span>
          </div>
          <i @click="star" class="iconfont iconshoucang text-24 pl-2" :class="{'text-pure-red': detail.has_star}"></i>
          <i class="iconfont iconfenxiang pl-2 text-24"></i>
        </div>
      </div>

      <!-- 获取input焦点之后弹出的文本域 -->
      <div v-show="!isFocus" class="flex justify-between items-end">
        <textarea @blur="isFocus=1" v-model="replyMsg" ref="textarea" rows="3" placeholder="回复" class="text-14 flex-1 rounded bg-gray-400 p-1 resize-none placeholder-gray-600 mr-2"></textarea>
        <div class="text-12 text-white w-6 h-3 leading-3 bg-pure-red rounded-full text-center" @mousedown="sendComment($event)">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import HmComment from '@/components/Hm-Comment'
export default {
  components: {
    HmComment
  },
  data () {
    return {
      detail: {
        user: {}
      },
      isFocus: 1, // 标记文本域是否显示
      commentList: [], // 评论列表
      parentId: '', // 回复的父评论id
      replyMsg: '' // 双向绑定文本域内容
    }
  },
  created () {
    this.getPostDetail()
    this.getCommentList()
  },
  methods: {
    // 获取文章详情
    async getPostDetail () {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)

      const { data } = res.data
      this.detail = data
    },
    // 获取评论列表
    async getCommentList () {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)

      const { data } = res.data
      this.commentList = data
    },
    // 切换点赞状态
    async toggleLike () {
      const id = this.detail.id // 文章id
      await this.$axios.get(`/post_like/${id}`)
      this.getPostDetail()
    },
    // 切换关注状态
    async toggleFollow (status) {
      const id = this.detail.user.id // 作者id

      // 关注状态映射
      let followDict = {
        'follow': {
          url: `/user_follows/${id}`,
          msg: '关注成功'
        },
        'unfollow': {
          url: `/user_unfollow/${id}`,
          msg: '取消关注'
        }
      }
      // 发请求改关注状态
      await this.$axios.get(followDict[status].url)
      this.$toast.success(followDict[status].msg) // 操作成功提示框
      this.detail.has_follow = !this.detail.has_follow // 关注状态取反
    },
    // 获取input焦点后, 显示文本域
    async showTextarea (tag, cleanParenIdTag) {
      this.parentId = cleanParenIdTag ? this.parentId : ''
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 切换收藏状态
    async star () {
      const id = this.detail.id
      const res = await this.$axios.get(`/post_star/${id}`)

      const { message } = res.data
      this.$toast.success(message)
      this.getPostDetail()
    },
    // 回复评论功能
    reply (id) {
      this.parentId = id
      this.showTextarea(this.isFocus = 0, 'noclean')
    },
    // 发送评论
    async sendComment (e) {
      e.preventDefault()
      const id = this.detail.id // 文章id
      await this.$axios.post(`/post_comment/${id}`, {
        content: this.replyMsg,
        parent_id: this.parentId
      })

      // 评论发表成功后, 重新渲染评论列表 => 隐藏文本域 => 清空文本域内容
      this.$toast.success('评论发布成功')
      this.getCommentList()
      this.detail.comment_length++
      this.isFocus = 1
      this.content = ''
      this.parentId = ''
    }
  },

  watch: {
    // 监听路由的变化，如果地址改变了，重新获取数据
    $route () {
      this.getPostDetail()
      this.getCommentList()
    }
  }
}
</script>
