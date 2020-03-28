<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header flex items-center h-5 pr-2 pl-1" style="background-color: red">
      <!-- 左侧图标 -->
      <i class="iconfont iconnew w-6 text-white" style="font-size: 50px"></i>

      <!-- 中间搜索框 -->
      <div class="search flex-1 text-14 text-center text-white h-3 leading-3 rounded-full" style="background-color: rgba(255, 255, 255, 0.5)" @click="$router.push('/search')">
        <i class="iconfont iconsearch"></i>
        <span class="pl-1">搜索新闻</span>
      </div>

      <!-- 右侧用户图标 -->
      <div class="right w-6 text-white" @click="$router.push('/userinfo')">
        <i class="iconfont iconwode text-24 float-right"></i>
      </div>
    </div>

    <!-- 分类tab栏及内容-->
    <van-tabs v-model="activeIndex" sticky swipeable>
      <van-tab v-for="item in tabList" :key="item.id" :title="item.name">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getPostList(pageIndex++)"
            :immediate-check="false"
            :offset="50"
          >
            <!-- 渲染文章的内容 -->
            <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import HmPost from '@/components/Hm-Post'
export default {
  name: 'home',
  components: {
    HmPost
  },
  data () {
    return {
      activeIndex: localStorage.getItem('token') ? 1 : 0,
      activeTab: {},
      // 存放所有的tab分类
      tabList: [],
      postList: [],
      pageIndex: 1,
      pageSize: 5,
      // List的加载状态
      loading: false,
      refreshing: false,
      finished: false
    }
  },
  async created () {
    await this.getTabList()
    this.getPostList()
  },
  methods: {
    // 获取分类tab栏数据
    async getTabList () {
      const activeTabs = localStorage.getItem('activeTabs')

      // 如果localStorage没有活跃tab栏, 发请求获取tab栏
      if (activeTabs) {
        this.tabList = JSON.parse(activeTabs)
      } else {
        const res = await this.$axios.get('/category')
        const { data } = res.data
        this.tabList = data
      }
    },

    // 获取当前分类下的数据
    async getPostList () {
      this.activeTab = this.tabList[this.activeIndex]
      // 获取分类id后, 发请求

      const id = this.activeTab.id
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })

      const { data } = res.data

      // 文章数据缓存在分类的postList内
      this.postList = [...this.postList, ...data]

      // 关闭vant的Loading和refresh状态
      this.loading = false
      this.refreshing = false

      data.length < this.pageSize ? this.finished = true : this.finished = false
    },

    // 下拉刷新
    onRefresh () {
      // 重置: 加载状态, 数据, 完成状态
      this.loading = true
      this.postList = []
      this.finished = false

      this.getPostList(this.pageIndex = 1)
    }
  },
  watch: {
    activeIndex (value) { this.onRefresh() }
  }
}
</script>
