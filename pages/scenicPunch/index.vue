<template>
  <view>
    <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
      <swiper-item class="swiper-item" v-for="item in swiperList" :key="item.id">
        <image :src="item" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="scetion">
      <view class="title-wrap">
        <text class="title nowrap">{{query.name}}</text>
        <view class="other" @tap="toNewsDetail"><text class="iconfont icon">&#xe969;</text>出游攻略</view>
      </view>
      <view class="descri">{{query.description}}</view>
      <map class="map" :title="cc" :longitude="query.location.lon" :latitude="query.location.lat" :scale="scale" :markers="covers" :enable-zoom="false" :enable-scroll="false" @tap="toMap"></map>
    </view>
    <logo />

    <view class="button" @tap="toFace">获取视频</view>
  </view>
</template>

<script>
import {
  getUserInfo,
  register,
  updateUserNickName
} from '@/api/index'
export default {
  data() {
    return {
      swiperList: [],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      list: [],
      query: {},
      scale: 16,
      covers: [],
      scenicInfo: {},
	  loginFlag: false,
	  userInfo: null
    }
  },
  methods: {
    // 去获取视频
    async toFace() {
		var that = this
		if(that.userInfo && that.userInfo.nickName) {
			uni.navigateTo({
			  url: `/pages/face/index?caseId=${this.scenicInfo.exScenicId}&vlogVideoPrice=${this.scenicInfo.vlogVideoPrice}`
			})
		}else{
			let [com, sus, fail] = await uni.getUserProfile({desc: '用于完善用户资料'})
			console.log(sus)
			if(sus){
				console.log("获取用户授权信息成功", sus);
				const res = await updateUserNickName({ nickName: sus.userInfo.nickName })
				uni.hideLoading()
				if (res.code !== 200) return uni.showToast({
				  title: res.msg,
				  icon: 'none'
				}) 
				if (res.code == 200) {
					uni.navigateTo({
					  url: `/pages/face/index?caseId=${this.scenicInfo.exScenicId}&vlogVideoPrice=${this.scenicInfo.vlogVideoPrice}`
					})
				}
			}
		}
    },
    // 定位
    toMap() {
      const query = this.query
      uni.openLocation({
        latitude: Number(query.location.lat),
        longitude: Number(query.location.lon),
        name: query.name,
        address: query.name,
        success: () => {},
        fail: (err) => {
          console.log(err)
        }
      })
    },
    // 去出游攻略
    toNewsDetail() {
      uni.navigateTo({
        url: `/pages/newsDetail/index?articleId=7`
      })
    },
	async init() {
	  this.loginFlag = false
	  if (uni.getStorageSync('token')) {
	    const productType = uni.getStorageSync('productType')
	    uni.showLoading({
	      title: '加载中',
	      mask: true
	    })
	    const res = await getUserInfo({ productType })
	    uni.hideLoading()
	    if (res.code === 200) {
			this.userInfo = res.data
	      if (res.data.vlogUserId) {
	        this.loginFlag = true
	      } else {
	        await this.register()
	      }
	    }
	  }
	},
	// 注册VLog
		async register() {
	  uni.showLoading({
	    title: '加载中',
	    mask: true
	  })
			const res = await register()
	  uni.hideLoading()
			if (res.code !== 200) {
				throw res.msg
			} else {
	    this.loginFlag = true
	  }
		},
  },
  onLoad() {
    this.scenicInfo = this.$store.state.scenicInfo
    this.query = this.$store.state.punchInPoint
    console.log(this.$store.state.punchInPoint)
    this.covers = [
      {
        title: this.query.name,
        width: 22,
        height: 22,
        latitude: this.query.location.lat,
        longitude: this.query.location.lon,
        iconPath: '/static/images/scenic/icon.png'
      }
    ]
    this.swiperList = [this.query.thumbnailUrl]
	this.init()
  }
}
</script>

<style lang="scss">
page {
  background: #F6F6F6;
}
.swiper {
	width: 100%;
	height: 420upx;

	.swiper-item {
		image {
			width: 100%;
			height: 420upx;
		}
	}
}

.scetion {
  position: relative;
  margin: 0 auto;
  margin-top: -56upx;
  box-sizing: border-box;
  border-radius: 16upx;
  padding: 0upx 24upx 32upx 24upx;
  width: calc(100% - 48upx);
  background: #FFF;


  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1upx solid #EEE;
    height: 112upx;
    .title {
      font-size: 34upx;
      font-weight: bold;
      color: #52C234;
    }
    .other {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      margin-left: 20upx;
      border-radius: 28upx;
      padding: 0 18upx;
      height: 56upx;
      font-size: 24upx;
      color: #FFF;
      background: #52C234;
      .icon {
        margin-right: 10upx;
        font-size: 32upx;
      }
    }
  }
  .descri {
    margin-top: 14upx;
    font-size: 28upx;
    line-height: 42upx;
  }
  .map {
    margin-top: 32upx;
    width: 100%;
    height: 160upx;
  }
}

.button {
  position: fixed;
  bottom: 88upx;
  left: calc((100% - 702upx) / 2);
  border-radius: 40upx;
  width: 702upx;
  height: 80upx;
  font-size: 34upx;
  font-weight: bold;
  line-height: 80upx;
  text-align: center;
  color: #FFF;
  background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);
}

</style>