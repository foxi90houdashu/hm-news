<template>
  <div>
    <hm-header>我的关注</hm-header>
    <div v-for="item in follow_list" :key="item.id" class="follow-list py-3 px-2 flex items-center border-b border-gray-400">
      <img class="mr-2 rounded-full" :src="$axios.defaults.baseURL + item.head_img" alt="" width="50" height="50">
      <div class="flex-1 text-16">
        <p class="text-gray-800">{{item.nickname}}</p>
        <p class="text-gray-500">{{item.create_date | time}}</p>
      </div>
      <div @click="unfollow(item.id)" class="w-8 text-center text-12 py-1 text-gray-700 bg-gray-300 rounded-full">取消关注</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      follow_list: []
    }
  },
  created () {
    this.getFollowList()
  },
  methods: {
    // 获取关注列表
    async getFollowList () {
      const res = await this.$axios.get('/user_follows')
      const { data } = res.data
      this.follow_list = data
    },
    // 取关
    async unfollow (id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '确定取消关注吗?'
        })

        // 取关请求
        await this.$axios.get(`/user_unfollow/${id}`)
        this.$toast.success('取关成功')

        // 重新获取关注列表
        this.getFollowList()
      } catch { this.$toast('取消操作') }
    }
  }
}
</script>
