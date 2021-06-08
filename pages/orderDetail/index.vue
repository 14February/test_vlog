<template>
  <view>
    <view class="video-wrap">
      <video class="video" id="myVideo" :src="vlogVideoUrl" @error="videoErrorCallback" controls :show-fullscreen-btn="orderInfo.payStatus===1"></video>
      <image v-if="orderInfo.payStatus!==1" class="watermark" src="/static/images/face/watermark.png" mode="widthFix" />
    </view>
    <view class="section">
      <view class="name-status">
        <view class="name-date"><text class="name nowrap">{{orderInfo.scenicName}}</text><text class="date">（{{orderInfo.createTime|dateFormat('MM')}}月{{orderInfo.createTime|dateFormat('DD')}}）</text></view>
        <view class="status">{{orderInfo.payStatus === 1 ? '已支付' : '未支付'}}</view>
      </view>
      <view class="orderId">时间：{{orderInfo.duration|durationFormat}}  订单号：{{orderInfo.orderId}}</view>
      <view class="descri-wrap">
        <view class="title">景区简介：</view>
        <view class="content">{{orderInfo.description||'暂无简介'}}</view>
      </view>
    </view>
    <template v-if="orderInfo.payStatus === 0">
      <view class="buttons b0">
        <view class="list" @tap="vlogPayClick">立即支付 {{orderInfo.payMoney}}元</view>
      </view>
    </template>
    <template v-if="orderInfo.payStatus === 1">
      <view class="buttons b1">
        <view class="list" @tap="toDownloadFile"><text class="iconfont icon">&#xe68f;</text>保存到本地</view>
        <button class="list" open-type="share"><text class="iconfont icon">&#xe740;</text>分享视频</button>
      </view>
    </template>
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
              <view class="price">¥<text class="num">{{orderInfo.payMoney}}</text>/次</view>
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
              <view class="price">¥<text class="num">{{orderInfo.payMoney}}</text>/次</view>
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
  getOpenid,
  vlogPay,
  queryOrderDetail,
  getProductList,
  queryCoupon,
  freeDownload,
  freePay
} from '@/api/index'
export default {
  data() {
    return {
      openId: '',
      orderInfo: {},
      vlogVideoUrl: '',
      videoError: false,
      couponList: [],
      couponIndex: 0,
      cardFlag: false,
      product: {}
    }
  },
  mixins: [checkLogin, queryUserCard, checkUserCard],
  methods: {
    videoErrorCallback() {
      this.videoError = true
      return uni.showToast({
        title: '资源失效,无法预览',
        icon: 'none'
      })
    },
    // 获取openid
    async getOpenid(loginCode) {
      const productType = uni.getStorageSync('productType')
      const res = await getOpenid({ loginCode, productType })
      if (res.code == 200) {
        this.openId = res.data.openid
      }
    },
    // 点击支付
    vlogPayClick() {
      this.checkLogin({
        success: () => {
          this.queryUserCard({
            success: (res) => {
              if (this.orderInfo.payMoney == 0) {
                this.freePay()
              } else {
                this.vlogPay()
              }
            }
          })
        }
      })
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
    // 支付
    async vlogPay() {
      const that = this
      if (this.videoError) return uni.showToast({
        title: '资源失效，无法支付',
        icon: 'none'
      })
      const { openId } = this
      const orderId = this.orderInfo.orderId

      const res = await vlogPay({ openId, orderId })
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
            that.$refs.coupon.close()
            uni.showToast({
              title: '支付成功',
              mask: true,
              duration: 2000,
              complete: res => {
                that.queryOrderDetail()
              }
            })
          }
        })
      }
    },
    // 免费支付
    async freePay() {
      const that = this
      if (this.videoError) return uni.showToast({
        title: '资源失效，无法支付',
        icon: 'none'
      })
      const orderId = this.orderInfo.orderId
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
        uni.showToast({
          title: '支付成功',
          mask: true,
          duration: 2000,
          complete: res => {
            that.queryOrderDetail()
          }
        })
      }
    },
    couponChange(index) {
      this.couponIndex = index
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
        this.$refs.coupon.close()
        uni.showToast({
          title: '支付成功',
          success: () => {
            this.queryOrderDetail()
          }
        })
      }
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
    toDownloadFile() {
      const that = this
      uni.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            // 用户未授权定位,去授权
            uni.showModal({
              title: '提示',
              content: '您未授权保存相册，为了您的正常使用，请授权保存相册。',
              showCancel: false,
              confirmText: '去授权',
              confirmColor: "#52C234",
              success: function(res) {
                if (res.confirm) {
                  uni.openSetting({})
                }
              }
            })
          } else {
           that.downloadFile()
          }
        },
        fail() {
          uni.showToast({
            title: '获取保存相册权限失败',
            icon: 'none'
          })
        }
      })
    },
    // 保存相册
    downloadFile() {
      if (this.videoError) return uni.showToast({
        title: '资源失效，无法下载',
        icon: 'none'
      })
      if (this.vlogVideoUrl == null) return uni.showToast({
        title: '视频合成中，暂时不能下载',
        icon: 'none'
      })
      uni.showLoading({
        title: '缓存中',
        mask: true
      })
      uni.downloadFile({
        url: this.vlogVideoUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            console.log(1,res)
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                uni.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: () => {
                    uni.showToast({
                      title: '保存到本地成功',
                      duration: 2000
                    })
                    console.log('保存成功')
                  },
                  fail: (err) => {
                    console.log(err.errMsg)
                    uni.showToast({
                      title: err.errMsg,
                      icon: 'none'
                    });
                  },
                  complete: () => {
                    uni.hideLoading()
                  }
                })
              }
            })
          }
        },
        fail: (err) => {
          uni.showToast({
            title: err.errMsg,
            icon: 'none'
          });
        }
      })
    },
    // 订单详情
    async queryOrderDetail() {
      const { orderId } = this
      const res = await queryOrderDetail({ orderId })
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
        this.orderInfo = res.data
        this.vlogVideoUrl = res.data.serverFixedUrl ? res.data.serverFixedUrl : res.data.vlogVideoUrl
      }
    }
  },
  onShow() {
    uni.login({
      success: res => {
        this.getOpenid(res.code)
      }
    })
    uni.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {}
    })
  },
  onLoad(options) {
    this.orderId = options.orderId || ''
    this.queryOrderDetail()
    // this.getProductList()
  }
}
</script>

<style lang="scss">
page {
  background: #F6F6F6;
}


.section {
  margin: 20upx auto;
  border-radius: 16upx;
  padding: 32upx 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .name-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48upx;
    .name-date {
      display: flex;
      align-items: center;
      overflow: hidden;
      .name {
        font-size: 34upx;
        font-weight: bold;
      }
      .date {
        flex: 0 0 auto;
        font-size: 28upx;
        font-weight: normal;
      }
    }

    .status {
      flex: 0 0 auto;
      margin-left: 20uox;
      font-size: 28upx;
      color: #52C235;
    }
  }

  .orderId {
    font-size: 24upx;
    line-height: 34upx;
    color: #666;
  }

  .descri-wrap {
    margin-top: 18upx;
    
    border-top: 1upx solid #EEE;
    font-size: 28upx;
    line-height: 42upx;

    .title {
      margin-bottom: 16upx;
      font-weight: bold;
      padding: 16upx 0;
    }

    .content {
      min-height: 168upx;
    }
  }
}

.buttons {
  position: fixed;
  bottom: 20upx;
  left: 0;
  width: 100%;

  &.b0 {
    .list {
      margin: 0 auto;
      border-radius: 40upx;
      width: calc(100% - 48upx);
      height: 80upx;
      font-size: 38upx;
      font-weight: bold;
      line-height: 80upx;
      text-align: center;
      color: #FFF;
      background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);
    }
  }

  &.b1 {
    display: flex;
    border-top: 1upx solid #EEE;
    .list {
      box-sizing: border-box;
      border-right: 1upx solid #EEE;
      width: 50%;
      height: 98upx;
      font-size: 28upx;
      line-height: 98upx;
      text-align: center;
      color: #666;

      .icon {
        margin-right: 10upx;
        font-size: 28upx;
      }
      
    }
    button {
      border-radius: 0;

      &::after {
        border: none;
        border-radius: 0!important;
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

.video-wrap {
  position: relative;
  width: 100%;
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
    width: 100%;
    height: 420upx;
  }
}
</style>