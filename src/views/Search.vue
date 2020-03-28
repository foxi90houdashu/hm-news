<template>
    <div class="px-1">
      <!-- 头部 -->
      <div class="flex items-center h-6">
        <i class="iconfont iconjiantou w-4" @click="back()"></i>
        <div class="flex-1 relative">
          <i class="iconfont iconsearch absolute top50 translateY text-gray-600" style="left: 0.5rem"></i>
          <!-- 搜索框 -->
          <input type="text" class="bg-transparent h-4 w-full pl-4 rounded-full border border-gray-500 text-14" placeholder="请输入搜索关键字" v-model="keyword">
        </div>
        <span class="text-14 pl-2 pr-1" @click="search">搜索</span>
      </div>

      <!-- 搜索到的文章 -->
      <div class="post-list" v-if="postList.length > 0">
        <hm-post v-for="item in postList" :key="item.id" :post="item"></hm-post>
      </div>

      <!-- 历史记录 & 热门搜索 -->
      <div class="text-14" v-else>
        <div class="pt-1 pb-2 border-b border-gray-400">
          <h2 class="font-bold h-4">历史记录</h2>
          <div class="record-box">
            <span v-for="item in history" :key="item" @click="search(keyword=item)">{{item}}</span>
          </div>
        </div>
        <div>
          <h2 class="font-bold h-6 leading-6">热门搜索</h2>
          <div class="record-box">
            <span v-for="item in hotKeys" :key="item" @click="search(keyword=item)">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import HmPost from '@/components/Hm-Post'
export default {
  components: {
    HmPost
  },
  data () {
    return {
      keyword: '',
      hotKeys: ['说好不哭', '王祖贤', '性感', '关晓彤'],
      history: JSON.parse(localStorage.getItem('history')) || [],
      postList: []
    }
  },
  methods: {
    async search () {
      const res = await this.$axios.get(`/post_search`, {
        params: { keyword: this.keyword }
      })

      const { data } = res.data

      // 得到搜索结果列表, 存history
      // 没有结果的时候, keyword='', 所有用个变量存起来防止keyword存不到history
      let temKey = this.keyword

      // 如果没有结果, 给个提示信息并清空keyword
      if (data.length) {
        this.postList = data
      } else {
        this.$toast('无搜索结果')
        this.keyword = ''
      }

      // 把搜索词存到history里
      this.history = this.history.filter(item => item !== temKey)
      this.history.unshift(temKey)

      localStorage.setItem('history', JSON.stringify(this.history))
    },
    // 返回按钮
    back () {
      this.keyword ? this.keyword = '' : this.$router.back()
    }
  },
  watch: {
    keyword (value) {
      if (value === '') { this.postList = [] }
    }
  }
}
</script>

<style scoped>
  .record-box {
    text-align: center;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
    grid-gap: 12px;
  }
</style>
