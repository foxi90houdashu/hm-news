<template>
  <div>
    <hm-header>栏目管理</hm-header>

    <div class="p-1">
      <div>
        <p class="text-14 text-gray-600 bg-gray-100">点击删除以下频道（至少保留3个）</p>
        <div class="tab-box">
          <span class="text-18 text-center border border-gray-400" v-for="(item, index) in activeTabs" :key="item.id" @click="del(index)">{{item.name}}</span>
        </div>
      </div>

      <div>
        <p class="text-14 text-gray-600 bg-gray-100">点击添加以下频道</p>
        <div class="tab-box">
          <span class="text-18 text-center border border-gray-400" v-for="(item, index) in deactiveTabs" :key="item.id" @click="add(index)">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTabs: [],
      deactiveTabs: []
    }
  },
  created () {
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    const deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))

    // 先从localStorage中获取分栏, 如果没有 => 发请求获取
    if (activeTabs && deactiveTabs) {
      this.activeTabs = activeTabs
      this.deactiveTabs = deactiveTabs
    } else {
      this.getTabList()
    }
  },
  methods: {
    // 获取栏目
    async getTabList () {
      const res = await this.$axios.get('/category')
      const { statusCode, data } = res.data

      this.activeTabs = statusCode === 200 ? data : []
    },
    // 变成不活跃项
    del (index) {
      if (this.activeTabs.length <= 3) {
        return
      }
      this.deactiveTabs.push(this.activeTabs[index])
      this.activeTabs.splice(index, 1)
    },
    // 变成活跃项
    add (index) {
      this.activeTabs.push(this.deactiveTabs[index])
      this.deactiveTabs.splice(index, 1)
    }
  },
  watch: {
    activeTabs () {
      localStorage.setItem('activeTabs', JSON.stringify(this.activeTabs))
      localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
    }
  }
}
</script>

<style scoped>
  .tab-box {
    padding: 0.25rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
    grid-gap: 12px;
  }
</style>
