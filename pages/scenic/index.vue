<template>
  <view>
    <template v-if="!noContent">
    <view class="list" v-for="item in scenicList" :key="item.id" @tap="toDetail(item)">
      <view class="text">
        <view class="name nowrap">{{ item.name }}</view>
        <view class="descri nowrap-double">{{ item.description }}</view>
        <view class="address"><text class="iconfont icon">&#xe790;</text><text class="nowrap">{{ item.address }}</text></view>
      </view>
      <image class="pic" :src="item.coverImgUrl" mode="" />
    </view>
    <noMore v-if="!loadMoreFlag" />
    </template>
    
    <noContent v-else>
			<view class="no-content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">暂无景区~</view>
			</view>
		</noContent>
    <logo />
  </view>
</template>

<script>
import noMore from '@/components/noMore/index.vue'
import noContent from '@/components/noContent/index.vue'
import {
	queryScenicList
} from '@/api/index'
export default {
  data() {
    return {
      province: '全部',
			lat: '',
			lon: '',
			scenicList: [],
			pageNo: 1,
			pageSize: 10,
			loadMoreFlag: true,
			noContent: true
    }
  },
  components: {
		noMore,
		noContent
	},
  methods: {
    // 景区列表
		async queryScenicList() {
      let { province } = this
      province = province === '全部' ? '' : province
			const { pageNo, pageSize, lat, lon } = this
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			const res = await queryScenicList({ pageNo, pageSize, lat, lon, province })
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
				this.scenicList = this.scenicList.concat(res.data.list)
			}
		},
    // 去详情
		toDetail(options) {
			// this.$store.commit('getScenicInfo', options)
			uni.navigateTo({
				url: `/pages/scenicDetail/index?id=${options.id}`
			})
		}
  },
  onReachBottom() {
		if (!this.loadMoreFlag) return
		this.pageNum++
		this.queryScenicList()
	},
  async onLoad() {
    try {
			await getLocation()
		} catch (error) {}
		this.lat = uni.getStorageSync('latitude')
		this.lon = uni.getStorageSync('longitude')
    await this.queryScenicList()
  }
}
</script>

<style lang="scss">
page {
  background: #F6F6F6;
}
.list {
  display: flex;
  justify-content: space-between;
  margin: 32upx auto;
  border-radius: 16upx;
  padding: 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .pic {
    border-radius: 8upx;
    width: 208upx;
    height: 208upx;
  }

  .text {
    width: calc(100% - 208upx - 16upx);

    .name {
      font-size: 28upx;
      font-weight: bold;
      line-height: 40upx;
    }

    .descri {
      margin-top: 16upx;
      height: 56upx;
      font-size: 20upx;
      line-height: 28upx;
      color: #999;
    }

    .address {
      display: flex;
      align-items: center;
      margin-top: 56upx;
      height: 40upx;
      font-size: 24upx;
      color: #666666;

      .icon {
        flex: 0 0 auto;
        margin-right: 8upx;
        font-size: 24upx;
      }
    }
  }
}
</style>