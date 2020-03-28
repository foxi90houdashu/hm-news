<template>
  <div>
    <hm-header>编辑资料</hm-header>
    <!-- 用户头像 -->
    <div class="py-2 text-center relative">
      <img :src="avatar" alt="" class="rounded-full inline-block w-8 h-8">
      <van-uploader :after-read="afterRead" class="absolute opacity-0 top50 left50 translateXY"/>
    </div>

    <!-- 用户信息区 -->
    <hm-usernav nav-title='昵称' :nav-desc='profile.nickname' @click="showVant('nickname')"></hm-usernav>
    <hm-usernav nav-title='密码' nav-desc='******' @click="showVant('password')"></hm-usernav>
    <hm-usernav nav-title='性别' :nav-desc='profile.gender === 1 ? "男" : "女" ' @click="showVant('gender')"></hm-usernav>

    <!-- vant修改提示框 -->

    <!-- 改昵称 -->
    <van-dialog v-model="isShowNickname" title="修改昵称" show-cancel-button @confirm="changeInfo('nickname')">
      <van-field placeholder="修输入户名" v-model="nickname" />
    </van-dialog>

    <!-- 改密码 -->
    <van-dialog v-model="isShowPwd" title="修改密码" show-cancel-button @confirm="changeInfo('password')">
      <van-field placeholder="请输入密码" v-model="password" />
    </van-dialog>

    <!-- 改性别 -->
    <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button @confirm="changeInfo('gender')">
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>

    <!-- 准备一个遮罩层 -->
    <div class="fixed w-screen h-screen z-50 top-0" v-show="isShowMask">
      <!-- 该组件专门用于写一些demo测试 -->
      <vueCropper
        ref="cropper"
        :img="option.img"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber">
      </vueCropper>
      <van-button class="fixed top-0 left-0" type="primary" @click="crop">确定裁剪图片</van-button>
      <van-button class="fixed top-0 right-0" type="danger" @click="isShowMask = false">取消</van-button>
    </div>
  </div>
</template>

<script>
import img from '../assets/avatar.jpg'
import { VueCropper } from 'vue-cropper'

export default {
  components: {
    VueCropper
  },
  created () {
    this.getProfile()
  },
  data () {
    return {
      profile: {},
      nickname: '',
      password: '',
      gender: 0,
      head_img: '',
      isShowNickname: false,
      isShowPwd: false,
      isShowGender: false,
      // 是否限制遮罩层
      isShowMask: false,
      option: {
        img: '',
        info: true, // 裁剪框的大小信息
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [4, 4] // 截图框的宽高比例
      }
    }
  },
  methods: {
    // 获取用户数据用来渲染页面
    async getProfile () {
      const res = await this.$axios.get('/user/' + localStorage.getItem('user_id'))
      this.profile = res.data.data
    },

    // 根据用户点击的信息, 显示Vant, 修改数据
    showVant (singleInfo) {
      // 创建传入数据与要执行函数的映射
      let changeDict = {
        'nickname': function () {
          this.isShowNickname = true
          this.nickname = this.profile.nickname
        },
        'password': function () {
          this.isShowPwd = true
          this.password = this.profile.password
        },
        'gender': function () {
          this.isShowGender = true
          this.gender = this.profile.gender
        }
      }
      changeDict[singleInfo].call(this)
    },

    // 发请求修改数据
    async changeInfo (infoName) {
      let postData = {}
      postData[infoName] = this.$data[infoName]
      const userId = localStorage.getItem('user_id')

      const res = await this.$axios.post(`/user_update/${userId}`, postData)

      this.$toast.success(res.data.message)
      this.getProfile()
    },

    // 点击头像后, 显示裁剪遮罩层
    afterRead (file) {
      this.isShowMask = true
      this.option.img = file.content
    },

    // 得到裁剪图片->上传图片得到地址->发请求改图片
    crop () {
      this.$refs.cropper.getCropData(async imgData => {
        const file = this.convertBase64UrlToBlob(imgData)

        const fd = new FormData()
        fd.append('file', file)

        // 发请求上传图片
        const res = await this.$axios.post('/upload', fd, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })

        // 如果上传成功, head_img赋值(制造post数据), 再发请求修改图片
        this.head_img = res.data.data.url
        this.changeInfo('head_img')

        this.isShowMask = false
      })
    },

    // 可以把图片的base64编码转成一个file文件
    convertBase64UrlToBlob (urlData) {
      let bytes = window.atob(urlData.split(',')[1])// 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length)
      let ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/jpeg' })
    }
  },
  computed: {
    avatar () {
      if (this.profile.head_img) {
        return this.$axios.defaults.baseURL + this.profile.head_img
      }
      return img
    }
  }
}
</script>
