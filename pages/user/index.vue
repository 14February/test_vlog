<template>
  <view>
    <view class="personal-wrap">
      <image class="banner" :src="'vlog/user/banner.png'|imgUrlFormat" mode="" />
      <view class="personal">
        <open-data class="pic" type="userAvatarUrl"></open-data>
        <view v-if="loginFlag" class="text" @tap="toPersonal">
          <open-data class="name" type="userNickName"></open-data>
          <text class="introduction">这是你加入云谷智游的第{{day}}天</text>
        </view>
        <view v-else class="text" @tap="toSignIn">
          <text class="button">登录</text>
        </view>
      </view>
      <view class="record">
        <view class="l" @tap.stop="toOrder">
          <text class="value">{{orderCount}}</text>
          <text class="label">我的订单</text>
        </view>
        <view class="l" @tap.stop="toCoupon">
          <text class="value">0</text>
          <text class="label">优惠券</text>
        </view>
      </view>
      <view v-if="cardInfo.validityTime" class="other">
        <image class="b" :src="'vlog/user/subBanner.png'|imgUrlFormat" mode="" />
        <view class="label">车主卡会员卡</view>
        <view class="value">有效期{{cardInfo.activateTime|dateFormat('YYYY-MM-DD')}}至{{cardInfo.validityTime|dateFormat('YYYY-MM-DD')}}</view>
      </view>
    </view>
    <view class="mine-wrap">
      <text class="l active">我的影像</text>
      <text class="l" @tap="toFootprint">我的足迹</text>
    </view>
    <template v-if="!noContent">
    <view class="mine-scetion">
      <view class="l" v-for="(item,index) in list" :key="item.orderId" @tap="toDetail(item)">
        <image class="pic" :src="item.fixThumbImageUrl" mode="aspectFill" @error="imageErrorCallback(index)" />
        <text class="nowrap text">{{item.scenicName}}</text>
      </view>
    </view>
    <noMore v-if="!loadMoreFlag" />
    </template>
    <noContent v-else>
			<view class="no-content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">{{loginFlag? '暂无影像~' : '登录获取影像~'}}</view>
			</view>
		</noContent>
    <logo />
    <tab-bar :current="tabBarCurrent" />
    <view class="h200"></view>
  </view>
</template>

<script>
import noMore from '@/components/noMore/index.vue'
import noContent from '@/components/noContent/index.vue'
import {
  checkLogin
} from '@/static/utils/checkLogin'
import {
  queryUserCard
} from '@/static/utils/queryUserCard'

import {
  queryCount,
  queryOrderList
} from '@/api/index'
export default {
  data() {
    return {
      tabBarCurrent: 1,
      loginFlag: false,
      list: [],
      userInfo: {},
      cardInfo: {},
      day: 0,
      pageNo: 1,
			pageSize: 10,
      loadMoreFlag: true,
			noContent: true,
      couponCount: 0,
      orderCount: 0,
    }
  },
  mixins: [checkLogin,queryUserCard],
  components: {
    noMore,
    noContent
  },
  methods: {
    imageErrorCallback(index) {
      this.list[index].fixThumbImageUrl = '/static/images/default/video.png'
    },
    // 去订单
    toOrder() {
      this.checkLogin({
				success:() => {
					this.queryUserCard({
						success: (res) => {
							uni.navigateTo({ 
                url: '/pages/order/index'
              })
						}
					})
				}
			})
    },
    // 去优惠券
    toCoupon() {
      uni.showToast({
        title: '暂未开放',
        icon: 'none'
      })
    },
    // 去登录
    toSignIn() {
      uni.navigateTo({
        url: '/pages/quickLogin/index'
      })
    },
    // 去个人信息
    toPersonal() {
      const userCard = this.userInfo.userCard
      const sex = userCard && userCard.sex ? userCard.sex : ''
      const idNum = userCard && userCard.idNum ? userCard.idNum : ''
      const phone = this.userInfo.phone
      const query = JSON.stringify({ sex, idNum, phone })
      uni.navigateTo({
        url: `/pages/personal/index?query=${query}`
      })
    },
    // 去我的足迹
    toFootprint() {
      uni.showToast({
        title: '暂未开放',
        icon: 'none'
      })
    },
    // 去订单详情（视频详情）
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/orderDetail/index?orderId=${item.orderId}`
      })
    },
    orderInit() {
      this.pageNo = 1
      this.list = []
      this.loadMoreFlag = true
			this.noContent = true
    },
    // 订单列表
    async queryOrderList() {
      const payStatus = ''
      const { pageNo, pageSize } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await queryOrderList(pageNo, pageSize, { payStatus })
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
        if (res.data.list.length < pageSize) this.loadMoreFlag = false
				this.noContent = res.data.total == 0 ? true : false
				this.list = this.list.concat(res.data.list)
      }
    },
    async queryCount() {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await queryCount()
      uni.hideLoading()
      if (res.code === 200) {
        this.couponCount = res.data.couponCount
        this.orderCount = res.data.orderCount
      }
    }
  },
  onReachBottom() {
		if (!this.loadMoreFlag || !this.loginFlag) return
		this.pageNo++
		this.queryOrderList()
	},
  onShow() {
    uni.hideTabBar()
    if (!uni.getStorageSync('token')) {
      this.loginFlag = false
      uni.showModal({
        title: "提示",
        content: '您还未登录，是否前往登录？',
        confirmColor: "#52C235",
        confirmText: '去登录',
        success: (res) => {
          if(res.confirm){
            uni.redirectTo({
              url: `/pages/quickLogin/index`
            })
          }
        }
      })
    } else {
      this.queryUserCard({
        success: (res) => {
          this.loginFlag = true
          this.userInfo = res
          if (res.userCard && res.userCard.bindStatus == 1 && res.userCard.cardStatus == 0) {
            this.cardInfo = res.userCard
          }
          this.day = Math.floor(((new Date()).getTime() - (new Date(res.createTime.replace(/\-/g, "/"))).getTime()) / (1000 * 60 * 60 * 24))
          this.orderInit()
          this.queryOrderList()
          this.queryCount()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.personal-wrap {
  position: relative;
  box-sizing: border-box;
  padding: 32upx 24upx 0 24upx;
  height: 352upx;
  .banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 352upx;
  }

  .personal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .pic {
      overflow: hidden;
      border-radius: 50%;
      width: 112upx;
      height: 112upx;
    }

    .text {
      display: flex;
      flex-direction: column;
      width: calc(100% - 112upx - 16upx);

      .name {
        font-size: 34upx;
        font-weight: bold;
        line-height: 48upx;
      }
      .introduction {
        margin-top: 4upx;
        font-size: 20upx;
        line-height: 28upx;
        color: #666;
      }

      .button {
        font-size: 34upx;
        font-weight: bold;
      }

    }
  }

  .record {
    display: flex;
    justify-content: flex-end;
    position: relative;
    box-sizing: border-box;
    padding-left: calc(112upx + 16upx);

    .l {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 92upx;

      .label {
        margin-top: 4upx;
        font-size: 20upx;
        line-height: 28upx;
        color: #999;
      }
      .value {
        font-size: 44upx;
        line-height: 56upx;
      }
    }
  }
  .other {
    position: relative;
    box-sizing: border-box;
    margin-top: 28upx;
    padding: 18upx 30upx 0 30upx;
    color: #AA7A36;
    
    .b {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 108upx;
    }
    .label {
      position: relative;
      font-size: 28upx;
      font-weight: bold;
      line-height: 40upx;
    }
    .value {
      position: relative;
      font-size: 20upx;
      line-height: 28upx;
    }
  }
}

.mine-wrap {
  display: flex;
  align-items: center;
  margin-top: 48upx;
  padding: 0 24upx;
  height: 40upx;
  font-size: 24upx;
  color: #666;

  .l {
    position: relative;
    margin-right: 32upx;
  }
  .active {
    font-size: 28upx;
    font-weight: bold;
    color: #333;
    &::before {
      position: absolute;
      bottom: 4upx;
      left: 5upx;
      content: '';
      width: calc(100% - 10upx);
      height: 8upx;
      background: hsla(107, 58%, 48%, .8);
    }
  }
}

.mine-scetion {
  display: flex;
  flex-wrap: wrap;
  margin-top: 32upx ;
  padding: 0 24upx;
  width: calc(100% - 48upx);

  .l {
    flex: 0 0 auto;
    position: relative;
    box-sizing: border-box;
    margin: 0 16upx 16upx 0;
    padding-top: 176upx;
    padding-left: 18upx;
    width: 222upx;
    height: 222upx;

    &:nth-of-type(3n) {
      margin-right: 0;
    }

    .pic {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 16upx;
      width: 222upx;
      height: 222upx;
    }

    .text {
      display: inline-block;
      position: relative;;
      border-radius: 23upx;
      padding: 0 16upx;
      max-width: calc(100% - 18upx - 18upx);
      height: 32upx;
      font-size: 20upx;
      line-height: 32upx;
      color: #FFF;
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>