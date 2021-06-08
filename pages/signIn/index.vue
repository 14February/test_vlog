<template>
  <view class="container">
    <view class="h95"></view>
    <view class="title">欢迎登录</view>
    <view class="title">云谷智游Vlog!</view>
    <view class="sub-title">点击“登录/注册”，即表示您同意<text @tap="toRead">《用户注册服务协议》</text></view>
    <view class="list">
      <input class="input" type="text" placeholder="请输入手机号" v-model="phone">
      <text v-if="phone.length" class="iconfont icon" @tap="clear('phone')">&#xe66e;</text>
    </view>
    <view class="list">
      <input class="input" type="text" placeholder="请输入验证码" v-model="verifyCode">
      <text v-if="verifyCode.length" class="iconfont icon" @tap="clear('verifyCode')">&#xe66e;</text>
      <text :class="['message',{'disabled': !phone.length}]" @tap="toMessage">{{message}}</text>
    </view>
    <view :class="['button',{'disabled': !phone.length || !verifyCode.length}]" @tap="toSignIn">登录注册</view>
  </view>  
</template>

<script>
import {
  getMsg,
  loginByPhone
} from '@/api/index'

import {
  checkPhone
} from '@/static/utils/tool'

export default {
  data() {
    return {
      phone: '',
      verifyCode: '',
      message: '获取验证码',
      sendStatus: false,
      timer: '',
      redirect: '',
      latitude: '',
      longitude: ''
    }
  },
  methods: {
    // 清空输入框
    clear(field) {
      this[field] = ''
    },
    // 去发短信
    async toMessage() {
      const that = this
      const { phone, sendStatus } = this
      if (!phone.length || sendStatus) return
      
      if (!checkPhone(phone)) return uni.showToast({
        title: "手机号格式错误",
        icon: 'none'
      })
      
      uni.showLoading({
        title: '短信发送',
        mask: true
      })
      const res = await getMsg({ phone })
      uni.hideLoading()

      if (res.code !== 200) return uni.showToast({
        title: res.msg,
        icon: 'none'
      })
      if (res.code === 200) {
        this.sendStatus = true
        let time = 60
        this.timer = setInterval(() => {
          if (time <= 0) {
            this.message = '获取验证码'
            this.sendStatus = false
            clearInterval(that.timer)
            return
          }
          time--
          this.message = `${time}S后重新发送`
        },1000)
      }
    },
    // 去登录
    async toSignIn() {
      const productType = uni.getStorageSync('productType')
      const { phone, verifyCode, latitude, longitude, redirect } = this
      if (!phone.length || !verifyCode.length) return

      if (!checkPhone(phone)) return uni.showToast({
        title: "手机号格式错误",
        icon: 'none'
      })

      uni.showLoading({
        title: '登录中',
        mask: true
      })
      const res = await loginByPhone({ phone, verifyCode, latitude, longitude, productType })
      uni.hideLoading()
      if (res.code !== 200) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#52C234",
        confirmText: '知道了',
        showCancel: false,
        success: (res) => {
          if(res.confirm){}
        }
      })
      if (res.code === 200) {
        uni.setStorageSync('token', res.data.token)
        uni.showToast({
          title: '登录成功',
          duration: 2000,
          success: function() {
            if (redirect) {
              uni.reLaunch({
                url: redirect
              })
            } else {
              uni.reLaunch({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    },
    //去查看协议
    toRead() {
      uni.showLoading({
        title: "加载中…",
        mask: true
      })
      uni.downloadFile({
        url: getApp().globalData.imgUrl + 'document/zkkdzxy.docx',
        success: res => {
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            success: res => {
              uni.hideLoading();
              console.log('打开文档成功')
            },
            fail: err => {
              console.log(err);
              uni.showToast({
                title: err
              })
            }
          });
        },
        fail: err => {
          uni.showToast({
            title: err
          })
        }
      })
    }
  },
  onUnload() {
    clearInterval(this.timer)
  },
  onShow() {},
  onLoad(options) {
    this.redirect = options && options.redirect ? `${decodeURIComponent(options.redirect)}` : ''
    this.latitude = uni.getStorageSync('latitude')
    this.longitude = uni.getStorageSync('longitude')
  }
}
</script>

<style lang="scss">
.container {
  padding: 0 48upx;
  width: calc(100% - 96upx);
}
.title {
  font-size: 48upx;
  line-height: 66upx;
}

.sub-title {
  margin-top: 16upx;
  margin-bottom: 65upx;
  font-size: 24upx;
  line-height: 34upx;
  color: #666;
}

.list {
  display: flex;
  align-items: center;
  border-bottom: 1upx solid #EEE;
  height: 110upx;

  .input {
    flex: 1 1 auto;
  }

  .icon {
    flex: 0 0 auto;
    padding-left: 20upx;
    color: #999;
  }

  .message {
    flex: 0 0 auto;
    margin-left: 20upx;
    font-size: 28upx;
    color: #52C234;

    &.disabled {
      color: #999;
    }
  }
}

.button {
  margin-top: 30upx;
  border-radius: 40upx;
  height: 80upx;
  font-size: 34upx;
  font-weight: bold;
  line-height: 80upx;
  text-align: center;
  color: #FFF;
  background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);

  &.disabled {
    color: #999;
    background: #EEE;
  }
}
</style>