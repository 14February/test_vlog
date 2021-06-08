<template>
  <view>
    <view class="h20"></view>
    <template v-if="!noContent">
    <view class="list" v-for="item in list" :key="item.slideId" @tap="toDetail(item)">
      <view class="title nowrap">{{item.slideTitle}}</view>
      <image class="pic" :src="item.slideUrl|imgUrlFormat" mode="aspectFill" />
      <view class="tool">
        <text class="text">预约全文</text>
        <text class="iconfont icon">&#xe682;</text>
      </view>
    </view>
    <noMore v-if="!loadMoreFlag"></noMore>
    </template>
    <noContent v-else>
			<view class="no_content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">暂无活动~</view>
			</view>
		</noContent>
  </view>
</template>

<script>
import noMore from '@/components/noMore/index.vue'
import noContent from '@/components/noContent/index.vue'
import {
  getActivityList,
  slideShowView
} from '@/api/index'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      loadMoreFlag: true,
      noContent: true,
      list: []
    }
  },
  components: {
    noMore,
    noContent
  },
  methods: {
    async getActivityList() {
      const { pageNum, pageSize } = this
      const productType = uni.getStorageSync('productType')
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getActivityList({ pageNum, pageSize, productType })
      uni.hideLoading()
      if (res.code !== 200) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#FF802B",
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
    async toDetail(item) {
      await slideShowView({slideId: item.slideId})
      // 文章详情
			if(1 == item.slideType){
				uni.navigateTo({
					url: `../actionCenterDetail/index?slideId=${item.slideId}`
				});
				return 
			}
			// 跳转H5
			if(2 == item.slideType){
				const url = item.slideDetails.replace(/\<\p\>/g,'').replace(/\<\/\p\>/g,'')
				getApp().globalData.webviewUrl = url
				wx.navigateTo({
					url: '/pages/website/index',
				})
				return 
			}
    }
  },
  onReachBottom() {
    if (!this.loadMoreFlag) return
    this.pageNum++
    this.getActivityList()
  },
  onLoad() {
    this.getActivityList()
  }
}
</script>

<style lang="scss">
.h20 {
  height: 20upx;
}
page {
  background: #F7F7F7;
}
.list {
  border-radius: 16upx;
  margin: 0 auto;
  margin-bottom: 20upx;
  padding: 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;
  .title {
    font-size: 34upx;
    font-weight: bold;
    line-height: 48upx;
  }

  .pic {
    border-radius: 8upx;
    margin-top: 16upx;
    width: 100%;
    height: 395upx;
  }
  .tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32upx;
    height: 48upx;
    font-size: 34upx;
    color: #666666;

    .icon {
      font-size: 30upx;
    }
  }
}
</style>