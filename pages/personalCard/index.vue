<template>
  <view class="container">
    <view class="h60"></view>
    <view class="list">
      <input class="input" type="text" placeholder="请输入会员卡号" v-model="cardNum">
      <text v-if="cardNum.length" class="iconfont icon" @tap="clear(0)">&#xe687;</text>
    </view>
    <view class="list">
      <input class="input" type="text" placeholder="请输入激活码" v-model="password">
      <text v-if="password.length" class="iconfont icon" @tap="clear(1)">&#xe687;</text>
    </view>
    <view :class="[{'disabled': !cardNum.length || !password.length},'button']" @tap="next">下一步</view>
  </view>
</template>

<script>
import {
  checkForBindCard,
  postBindCard
} from '@/api/index'
import {
  checkLogin
} from '@/static/utils/checkLogin'
export default {
  data() {
    return {
      cardNum: '',
      password: ''
    }
  },
  mixins: [checkLogin],
  methods: {
    clear(index) {
      if (index === 0) {
        this.cardNum = ''
      }
      if (index === 1) {
        this.password = ''
      }
    },
    next() {
      const { cardNum, password } = this
      if (!cardNum.length || !password.length) return
      this.checkLogin({
        success: () => {
          this.checkForBindCard()
        }
      })
    },
    //绑卡检查
    async checkForBindCard(){
      const { cardNum, password } = this
      const productType = uni.getStorageSync("productType")
      uni.showLoading({
        title: '校验中',
        mask: true
      })
      const res = await checkForBindCard({ cardNum, password, productType })
      uni.hideLoading()
      if (res.code !== 200 && res.code !== 408) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#52C234",
        confirmText: '知道了',
        showCancel: false,
        success: (res) => {
          if(res.confirm){}
        }
      })
      if(res.code == 200){
        this.postBindCard()
      }
      if(res.code == 408){
        uni.showModal({
          content: res.msg,
          confirmColor: "#52C234",
          success: res => {
            if (res.confirm) {
              this.postBindCard()
            }
          }
        })
      }
    },
    // 激活卡片
    async postBindCard() {
      const { cardNum, password } = this
      const productType = uni.getStorageSync("productType")
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await postBindCard({ cardNum, password, productType })
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
        uni.showModal({
          title: "提示",
          content: '绑定成功，还需完善信息',
          confirmColor: "#52C234",
          confirmText: '去完善',
          showCancel: false,
          success: (res) => {
            if(res.confirm){
              uni.reLaunch({
                url: '/pages/personInfo/index'
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
page {
  width: 100%;
}

.h60 {
  height: 60upx;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.list {
  display: flex;
  align-items: center;
  margin-bottom: 20upx;
  border-radius: 56upx;
  padding: 0 48upx;
  width: calc(100% - 96upx - 96upx);
  height: 112upx;
  background: #F5F5F5;

  .input {
    flex: 1 0 auto;
  }

  .icon {
    flex: 0 0 auto;
    padding-left: 10upx;
    color: #979797;
  }
}

.button {
  margin-top: 40upx;
  border-radius: 40upx;
  width: calc(100% - 96upx);
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
