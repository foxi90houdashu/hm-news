<template>
  <div>
    <hm-header>我的收藏</hm-header>
    <hm-post v-for="item in list" :key="item.id" :post="item"></hm-post>
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
      // 用于存放我的收藏数据
      list: []
    }
  },
  created () {
    // 获取我的收藏数据
    this.getFavoriteList()
  },
  methods: {
    async getFavoriteList () {
      const res = await this.$axios.get('/user_star')
      const { data } = res.data

      data.forEach(item => {
        item.comment_length = item.comments.length
      })
      this.list = data
    }
  }
}
</script>
