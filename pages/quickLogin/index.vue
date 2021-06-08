<template>
  <view class="container">
    <view class="h60"></view>
    <image class="pic" src="/static/images/tabbar/midButton.png" mode="" />
    <view class="shadow"></view>
    <view class="title">欢迎使用</view>
    <view class="title">云谷智游Vlog</view>
    <view class="h60"></view>
    <button class="button" open-type="getPhoneNumber" @getphonenumber="getPhone">一键登录</button>
    <view class="button disabled" @tap="toSignIn">手机登录</view>
  </view>  
</template>

<script>
import {
  getOpenid,
  getPhoneNumber,
  loginByWx
} from '@/api/index'
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
    // 去登录
    toSignIn() {
      const redirect = this.redirect
      uni.navigateTo({
        url: redirect ? `/pages/signIn/index?redirect=${encodeURIComponent(redirect)}`: `/pages/signIn/index`
      })
    },
    //获取openid
    async getOpenid(loginCode) {
      const productType = uni.getStorageSync('productType')
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getOpenid({ loginCode, productType })
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
      if (res.code == 200) {
        this.openId = res.data.openid
      }
    },
    getPhone(e) {
      this.getPhoneNumber(e.detail.encryptedData, e.detail.iv)
    },
    //获取手机号码
    async getPhoneNumber(encryptedData, iv) {
      if (!encryptedData || !iv) return
      const openId = this.openId
      uni.showLoading({
        title: '号码解析中',
        mask: true
      })
      const res = await getPhoneNumber({ encryptedData, iv, openId })
      uni.hideLoading()
      if (res.code !== 200) return uni.showToast({
        title: res.msg,
        icon: 'none'
      }) 
      if (res.code == 200) {
        this.loginByWx(res.data.phoneNumber)
      }
    },
    //微信一键登录
    async loginByWx(phone) {
      const { latitude, longitude, openId, redirect } = this
      const productType = uni.getStorageSync('productType')
      uni.showLoading({
        title: '登录中',
        mask: true
      })
      const res = await loginByWx({ openId, phone, latitude, longitude, productType })
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
    }
  },
  onUnload() {
    clearInterval(this.timer)
  },
  onShow() {
    //获取openid
    uni.login({
      success: res => {
        this.getOpenid(res.code)
      }
    })
  },
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

.pic {
  display: block;
  margin: 0 auto 64upx auto;
  border-radius: 50%;
  box-shadow: 0px 24px 48px 0px rgba(81,240,34,0.3);
  width: 192upx;
  height: 192upx;
}

.shadow {
  margin: 0 auto 48upx auto;
  border-radius: 50%;
  width: 136upx;
  height: 24upx;
  background: #EEEEEE;

}
.title {
  font-size: 48upx;
  line-height: 66upx;
  text-align: center;
}


.button {
  margin-bottom: 20upx;
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