<template>
  <view>
    <view :class="['list',{'disabled': item.status === 1}]" v-for="item in couponList" :key="item.id">
      <view class="name-date">
        <text class="name nowrap">{{item.name}}</text>
        <view class="date">{{item.expireTime|dateFormat('YYYY-MM-DD')}}到期</view>
      </view>
      <view class="status">{{item.status === 0 ? '正常' : '已失效'}}</view>
    </view>
    <noMore v-if="couponList.length" />
    <noContent v-if="!couponList.length">
			<view class="no-content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">暂无优惠券~</view>
			</view>
		</noContent>
  </view>
</template>

<script>
import noMore from '@/components/noMore/index.vue'
import noContent from '@/components/noContent/index.vue'
import {
  queryCoupon
} from '@/api/index'
export default {
  data() {
    return {
      couponList: []
    }
  },
  components: {
		noMore,
		noContent
	},
  methods: {
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
        this.couponList = res.data
      }
    }
  },
  onLoad() {
    this.queryCoupon()
  }
}
</script>

<style lang="scss">
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto 20upx auto;
  border-radius: 16upx;
  border: 2upx solid #F4BD71;
  padding: 26upx 32upx 28upx 32upx;
  width: calc(100% - 48upx - 64upx);
  height: 128upx;
  color: #A67836;
  background: linear-gradient(270deg, #FFE8BD 0%, #FFCD88 100%);

  .name-date {
    flex: 1 1 auto;
    overflow: hidden;
  }

  .name {
    font-size: 28upx;
    font-weight: bold;
    line-height: 40upx;
  }

  .date {
    font-size: 24upx;
    line-height: 34upx;
  }

  .status {
    flex: 0 0 auto;
    margin-left: 20upx;
    font-size: 24upx;
    font-weight: bold;
  }

  &.disabled {
    border-color: #DDD;
    color: #999;
    background: linear-gradient(270deg, #F7F7F7 0%, #E3E3E3 100%);
  }
}
</style>