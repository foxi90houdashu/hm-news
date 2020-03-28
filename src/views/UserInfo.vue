<template>
  <div>
    <hm-header>个人中心</hm-header>
    <!-- 用户信息头部 -->
    <div class="userinfo-header py-3 pl-2 pr-2 flex items-center  border-b-4 border-gray-300 border-t">

      <img :src="avatar" alt="用户头像" class="rounded-full mr-2 w-8 h-8" v-show="loading">

      <div class="userinfo-basic">
        <p class="text-16">
          <span v-if="profile.gender === 1" class="iconfont iconxingbienan text-blue-300 pr-1"></span>
          <span v-else class="iconfont iconxingbienv text-pink-400 pr-1"></span>
          <span class="text-gray-700">{{ profile.nickname }}</span>
        </p>
        <p class="text-gray-500 text-14">2019-10-10</p>
      </div>

      <span class="iconfont iconjiantou1 ml-auto text-gray-500"></span>
    </div>

    <!-- 用户导航 -->
    <hm-usernav nav-title='我的关注' nav-desc='关注的用户' @click="$router.push('/follow')"></hm-usernav>
    <hm-usernav nav-title='我的跟帖' nav-desc='跟帖/回复' @click="$router.push('/myComments')"></hm-usernav>
    <hm-usernav nav-title='我的收藏' nav-desc='文章/视频' @click="$router.push('/myFavorite')"></hm-usernav>
    <hm-usernav nav-title="栏目管理" nav-desc="自定义首页栏目" @click="$router.push('/tabManage')"></hm-usernav>
    <hm-usernav nav-title='设置' @click="$router.push('/editinfo')"></hm-usernav>
    <hm-usernav nav-title="退出登录" @click="logout"></hm-usernav>
  </div>
</template>

<script>
import img from '@/assets/avatar.jpg'

export default {
  // 创建对象时, 发ajax请求
  async created () {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('user_id')

    const res = await this.$axios.get(`/user/${id}`, {
      headers: {
        Authorization: token
      }
    })

    if (res.data.statusCode === 401) {
      this.$toast('用户验证失败')
    } else {
      this.profile = res.data.data
      this.loading = true
    }
  },
  data () {
    return {
      profile: {},
      loading: false
    }
  },
  computed: {
    avatar () {
      // 如果有头像, 设置头像, 如果没有就用默认头像
      if (this.profile.head_img) {
        return this.$axios.defaults.baseURL + this.profile.head_img
      }
      return img
    }
  },
  methods: {
    async logout () {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '确定要退出本系统吗?'
        })
        // 清除用户id和token
        localStorage.removeItem('user_id')
        localStorage.removeItem('token')
        // 返回登录页
        this.$router.push('/login')
        this.$toast.success('退出成功')
      } catch { this.$toast('操作取消') }
    }
  }
}
</script>
