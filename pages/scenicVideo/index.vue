<template>
  <view>
    <view class="video-wrap">
      <video class="video" id="myVideo" :src="videoUrl" @error="videoErrorCallback" controls :show-fullscreen-btn="false"></video>
      <image v-if="orderInfo.payStatus!==1" class="watermark" src="/static/images/face/watermark.png" mode="widthFix" />
    </view>
    <view class="section">
      <view class="name">{{query.name}}</view>
      <view class="descri">{{query.description}}</view>
    </view>

    <!-- <view class="other">
      <view class="title-wrap">
        <text class="title">其他热门打卡地</text>
        <text class="more">换一批</text>
      </view>
      <view class="content" v-if="list.length">
        <view class="list" v-for="item in list" :key="item.id">
          <image class="pic" src="https://idst-video-img.oss-cn-hangzhou.aliyuncs.com/H5/ma0ad818e-8440-67d5-0524-4261caf0c41b.jpg" mode="" />
          <text class="text nowrap">植物园</text>
        </view>
      </view>
    </view> -->
    <view class="h120"></view>
    <view class="footer" @tap="queryCouponClick">
      <view class="list g">视频获取<text class="unit">¥</text>{{query.vlogVideoPrice}}<text class="unit">/次</text></view>
    </view>
    <!-- 购卡 -->
    <uni-popup ref="cardPay" type="center">
      <view class="card-pay-dialog">
        <image class="pic" src="/static/images/scenic/card.png" mode="" />
        <view class="h">免费获取</view>
        <view class="p">缴纳¥{{product.price}}开通车主卡会员</view>
        <view class="p">缴可免费下载一次个人Vlog集锦</view>
        <view class="b" @tap="toMenber">
          <view class="f">微信支付</view>
          <view class="s">优惠价¥{{product.price}}/年</view>
        </view>
      </view>
    </uni-popup>
    <!-- 优惠券 -->
    <uni-popup ref="coupon" type="center">
      <view class="coupon-dialog">
        <view class="t">视频免费下载券</view>
        <scroll-view class="c" scroll-y="true" enable-flex>
          <!-- 会员 -->
          <template v-if="cardFlag">
            <template v-for="(item,index) in couponList">
            <view v-if="index === 0" :class="['l','r',{'active':index == couponIndex}]"  :key="index" @tap="couponChange(index)">
              <view class="name">付费下载</view>
              <view class="price">¥<text class="num">{{query.vlogVideoPrice}}</text>/次</view>
            </view>
            <view v-if="index !== 0" :class="['l',{'active':index == couponIndex}]"  :key="index" @tap="couponChange(index)">
              <view class="name">{{item.name}}</view>
              <view v-if="item.status === 0" class="date">{{item.expireTime|dateFormat('YYYY')}}年{{item.expireTime|dateFormat('MM')}}月{{item.expireTime|dateFormat('DD')}}日到期</view>
              <view v-else class="date">已失效</view>
            </view>
            </template>
          </template>
          <!-- 非会员 -->
          <template v-else>
            <view class="l active" @tap="couponChange(0)">
              <view class="name">付费下载</view>
              <view class="price">¥<text class="num">{{query.vlogVideoPrice}}</text>/次</view>
            </view>
            <view class="l" @tap="toMenber">
              <view class="name">车主卡免费视频下载券</view>
              <view class="date">暂无此券，点击获取</view>
            </view>
          </template>
        </scroll-view>
        <view class="f">
          <view class="b" @tap="toDown">使用下载</view>
          <view class="b cancal" @tap="couponClose">取消</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  checkLogin
} from '@/static/utils/checkLogin'
import {
  queryUserCard
} from '@/static/utils/queryUserCard'
import {
  checkUserCard
} from '@/static/utils/checkUserCard'
import {
  queryCoupon,
  vlogPay,
  freeDownload,
  getProductList,
  getOpenid,
  freePay
} from '@/api/index'
export default {
  data() {
    return {
      videoUrl: '',
      list: [{},{},{},{},{},{}],
      caseId: '',
      jobId: '',
      productId: '',
      openId: '',
      orderId: '',
      product: {},
      couponList: [],
      couponIndex: 0,
      query: {},
      videoError: false,
      cardFlag: false
    }
  },
  mixins: [checkLogin, queryUserCard, checkUserCard],
  methods: {
    videoErrorCallback() {
      this.videoError = true
    },
    couponChange(index) {
      this.couponIndex = index
    },
    queryCouponClick() {
      if (this.videoError) return uni.showToast({
        title: '请重新进入页面，重新下载一下吧~',
        icon: 'none'
      })
      this.checkLogin({
        success: () => {
          this.queryUserCard({
            success: (res) => {
              if (this.query.vlogVideoPrice == 0) {
                this.freePay()
              } else {
                this.vlogPay()
              } 
            }
          })
        }
      })
    },
    // 优惠券
    async queryCoupon() {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await queryCoupon()
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
        let list = [{}]
        this.couponList = list.concat(res.data.filter(item => item.status === 0))
        this.couponIndex = 0
        this.$refs.coupon.open()
      }
    },
    // 优惠券关闭
    couponClose() {
      this.$refs.coupon.close()
    },
    // 去下载收费和免费
    toDown() {
      const index = this.couponIndex
      // 收费与否
      if (index == 0) {
        this.vlogPay()
      } else {
        this.freeDownload()
      }
    },
    // 免费下载
    async freeDownload() {
      const couponId = this.couponList[this.couponIndex].id
      const { orderId } = this
      uni.showLoading({
        title: '生成中',
        mask: true
      })
      const res = await freeDownload({ couponId, orderId })
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
        this.$refs.cardPay.close()
        this.$refs.coupon.close()
        uni.showModal({
          title: "提示",
          content: res.msg,
          confirmColor: "#52C234",
          confirmText: '去查看',
          cancelText: '去首页',
          success: (res) => {
            if(res.confirm){
              uni.reLaunch({
                url: '/pages/order/index'
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
    // 支付
    async vlogPay() {
      const that = this
      const { orderId, openId } = this
      uni.showLoading({
        title: '支付中',
        mask: true
      })
      const res = await vlogPay({ openId, orderId })
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
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function(res) {
            that.$refs.cardPay.close()
            that.$refs.coupon.close()
            uni.showModal({
              title: "提示",
              content: '支付成功',
              confirmColor: "#52C234",
              confirmText: '去查看',
              cancelText: '去首页',
              success: (res) => {
                if(res.confirm){
                  uni.reLaunch({
                    url: '/pages/order/index'
                  })
                } else {
                  uni.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              }
            })
          }
        })
      }
    },
    // 免费支付
    async freePay() {
      const { orderId } = this
      uni.showLoading({
        title: '支付中',
        mask: true
      })
      const res = await freePay({ orderId })
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
          content: '支付成功',
          confirmColor: "#52C234",
          confirmText: '去查看',
          cancelText: '去首页',
          success: (res) => {
            if(res.confirm){
              uni.reLaunch({
                url: '/pages/order/index'
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
    // 获取产品
    async getProductList(){
      const type = uni.getStorageSync("productType")
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getProductList({ type })
      uni.hideLoading()
      if (res.code !== 200 && res.code !== 408) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#52C234",
        confirmText: '返回上页',
        showCancel: false,
        success: (res) => {
          if(res.confirm){
            uni.navigateBack()
          }
        }
      })
      if(res.code == 200){
        if (res.data.length) {
          this.product = res.data[0]
        }
      }
    },
    // 去购卡
    toMenber() {
      uni.navigateTo({
        url: `/pages/menber/index?productId=${this.product.productId}`
      })
    },
    //获取openid
    async getOpenid(loginCode) {
      const productType = uni.getStorageSync('productType')
      const res = await getOpenid({ loginCode, productType })
      if (res.code == 200) {
        this.openId = res.data.openid
      }
    }
  },
  onShow() {
    uni.login({
      success: res => {
        this.getOpenid(res.code)
      }
    })
  },
  onLoad(options) {
    const query = this.$store.state.scenicInfo
    this.query = query
    this.videoUrl = query.videoUrl
    this.caseId = options.caseId || ''
    this.jobId = options.jobId || ''
    this.productId = query.productId || ''
    this.orderId = query.orderId || ''
    // this.getProductList()
    console.log(this.query)
  }
}
</script>

<style lang="scss">
page {
  background: #F6F6F6;
}
.video {
  width: 750upx;
  height: 420upx;
}
.video-wrap {
  position: relative;
  width: 750upx;
  height: 420upx;

  .watermark {
    position: absolute;
    top: 0;
    left: 0;
    padding: 12upx;
    width: 174upx;
    background: rgba(255, 255, 255, .3);
  }
  .video {
    width: 750upx;
    height: 420upx;
  }
}

.section {
  margin: 0 auto;
  margin-top: 20upx;
  border-radius: 16upx;
  padding: 30upx 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .name {
    margin-bottom: 34upx;
    font-size: 34upx;
    font-weight: bold;
    line-height: 48upx;
  }

  .descri {
    font-size: 28upx;
    line-height: 42upx;
    color: #666;
  }
}

.other {
  margin: 0 auto;
  margin-top: 20upx;
  border-radius: 16upx;
  padding: 30upx 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32upx;

    .title {
      font-size: 34upx;
      font-weight: bold;
      line-height: 48upx;
    }

    .more {
      font-size: 28upx;
      color: #666;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    
    .list {
      display: flex;
      align-items: flex-end;
      position: relative;
      margin-right: calc(100% - (316upx * 2));
      margin-bottom: 24upx;
      width: 316upx;
      height: 160upx;

      &:nth-of-type(2n) {
        margin-right: 0;
      }
      .pic {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 16upx;
        width: 100%;
        height: 100%;
      }
      .text {
        position: relative;
        border-radius: 23upx;
        margin: 16upx;
        padding: 0 26upx;
        height: 32upx;
        font-size: 20upx;
        color: #FFF;
        background: rgba(0, 0, 0, .3);
      }
    }
  }
}

.footer {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 98upx;
  font-size: 34upx;
  font-weight: bold;
  line-height: 98upx;
  text-align: center;
  color: #54C53B;
  background: #FFF;

  .list {
    width: 100%;

    &.g {
      color: #FFF;
      background: #54C53B;
    }

    .unit {
      font-size: 24upx;
    }
  }
}

.card-pay-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16upx;
  width: 640upx;
  background: #FFF;

  .pic {
    position: relative;
    margin-top: -156upx;
    width: 640upx;
    height: 396upx;
  }

  .h {
    margin: 48upx 0 16upx 0;
    font-size: 40upx;
    font-weight: bold;
    line-height: 60upx;
  }

  .p {
    font-size: 34upx;
    line-height: 48upx;
    color: #666;
  }

  .b {
    display: flex;
    align-items: center;
    overflow: hidden;
    margin: 48upx 0 38upx 0;
    border-radius: 40upx;
    width: calc(100% - 24upx);
    height: 80upx;
    font-size: 34upx;
    font-weight: bold;
    line-height: 80upx;
    text-align: center;
    color: #FFF;
    background: #333;
    .f {
      width: 262upx;
      background: #52C234;
    }
    .s {
      position: relative;
      width: calc(100% - 262upx);

      &::after {
        position: absolute;
        top: 0;
        left: -25upx;
        content: '';
        width: 0upx;
        height: 0upx;
        border-bottom: 80upx solid #333;
        border-left: 25upx solid transparent;
      }
    }
  }
}

.coupon-dialog {
  border-radius: 16upx;
  width: 640upx;
  height: 698upx;
  background: #FFFFFF;

  .t {
    padding: 48upx 0 32upx 0;
    height: 48upx;
    font-size: 34upx;
    font-weight: bold;
    line-height: 48upx;
    text-align: center;
  }
  .c {
    height: calc(100% - 48upx - 48upx - 32upx - 112upx);
    .l {
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      margin: 0 auto 20upx auto;
      border: 2px solid #DDDDDD;
      border-radius: 16upx;
      padding: 24upx;
      width: 592upx;
      height: 128upx;
      color: #999;
      background: linear-gradient(270deg, #F7F7F7 1%, #E3E3E3 98%);

      &.active {
        border: 2upx solid #F4BD71;
        color: #A67836;
        background: linear-gradient(270deg, #FFE8BD 0%, #FFCD88 100%);
      }

      .name  {
        font-size: 28upx;
        font-weight: bold;
        line-height: 40upx;
      }
      .date {
        font-size: 24upx;
        line-height: 34upx;
      }

      &.r {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .price {
          font-size: 24upx;
          .num {
            font-size: 34upx;
          }
        }
      }
    }



  }
  .f {
    display: flex;
    box-sizing: border-box;
    border-top: 1upx solid #EEE;
    height: 112upx;
    line-height: 112upx;
    .b {
      box-sizing: border-box;
      border-right: 1upx solid #EEE;
      width: 50%;
      font-size: 34upx;
      font-weight: bold;
      text-align: center;
      color: #52C234;

      &.cancal {
        color: #999;
      }

      &:nth-last-of-type(1) {
        border-right: none;
      }
    }
  }
}
</style>