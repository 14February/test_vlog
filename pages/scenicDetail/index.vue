<template>
  <view>
    <page-nav-bar :bgColor="navBarBgColor" :fontColor="navBarFontColor" :title="query.name"></page-nav-bar>
    <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
      <swiper-item class="swiper-item" v-for="item in swiperList" :key="item.id">
        <image :src="item" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="scetion">
      <view class="text">
        <text class="name nowrap">{{query.name}}</text>
        <view class="label-wrap">
          <text class="l">暂无标签</text>
        </view>
        <view class="address nowrap">{{query.address}}</view>
      </view>
      <view class="pic-wrap" @tap="toMap">
        <image class="pic" :src="'vlog/scenic/map.png'|imgUrlFormat" mode="" />
        <image class="icon" src="/static/images/scenic/icon.png" mode="" />
        <text class="value">距离我{{query.distance|distanceFormat}}</text>
      </view>
    </view>
    <view class="other-wrap">
      <view class="title-wrap">
        <text class="title nowrap">大家都在这里打卡</text>
        <view class="other" @tap="toNewsDetail"><text class="iconfont icon">&#xe969;</text>出游攻略</view>
      </view>
      <view class="content">
        <view class="list" v-for="(item, index) in cameraPositions" :key="index" @tap="toPunch(item)">
          <image class="pic" :src="item.thumbnailUrl" mode="" />
          <text class="text nowrap">{{item.name}}</text>
        </view>
      </view>
    </view>
    <logo />
    <view v-if="loginFlag" class="button" @tap="toFace">获取视频</view>
    <button v-else class="button" open-type="getPhoneNumber" @getphonenumber="getPhone">一键登录</button>
  </view>
</template>

<script>
import pageNavBar from '@/components/pageNavBar/index.vue'
import {
  queryScenicDetail,
  getUserInfo,
  register,
  getPhoneNumber,
  getOpenid,
  loginByWx,
  queryVlogScenicDetail,
  updateUserNickName,
} from '@/api/index'

import {
	getLocation
} from '@/static/utils/tool'
export default {
  data() {
    return {
      id: '',
      swiperList: [],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      list: [],
      query: {},
      midButtonBackgroundColor: '#F6F6F6',
      navBarBgColor: 'transparent',
      navBarFontColor: '#FFF',
      loginFlag: false,
      openId: '',
      latitude: '',
      longitude: '',
      cameraPositions: [],
	  userInfo: null
    }
  },
  components: {
    pageNavBar
  },
  methods: {
    // 定位
    toMap() {
      const query = this.query
      uni.openLocation({
        latitude: query.lat,
        longitude: query.lon,
        name: query.name,
        address: query.address,
        success: () => {}
      })
    },
    toPunch(item) {
      if (!this.loginFlag) return uni.showToast({
        title: '您未登录',
        icon: 'none'
      })
      this.$store.commit('getPunchInPoint', {})
      this.$store.commit('getPunchInPoint', item)
      console.log(item)
      uni.navigateTo({
        url: `/pages/scenicPunch/index`
      })
    },
    // 去出游攻略
    toNewsDetail() {
      uni.navigateTo({
        url: `/pages/newsDetail/index?articleId=7`
      })
    },
    // 去获取视频
    async toFace() {
		var that = this
		if(that.userInfo && that.userInfo.nickName) {
			uni.navigateTo({
			  url: `/pages/face/index?caseId=${that.query.exScenicId}&vlogVideoPrice=${that.query.vlogVideoPrice}`
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
					  url: `/pages/face/index?caseId=${that.query.exScenicId}&vlogVideoPrice=${that.query.vlogVideoPrice}`
					})
				}
			}
		}
    },
    // 景区详情
    async queryScenicDetail() {
      const id = this.id
      const lat = this.latitude
      const lon = this.longitude
      const res = await queryScenicDetail({ id, lat, lon })
      if (res.code === 200) {
        this.query = res.data
        this.swiperList = [res.data.coverImgUrl]
        this.$store.commit('getScenicInfo', res.data)
        this.queryVlogScenicDetail(res.data.exScenicId)
      }
    },
    // 打卡点
    async queryVlogScenicDetail(caseId) {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await queryVlogScenicDetail({ caseId })
      uni.hideLoading()
      if (res.code !== 200) return uni.showModal({
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

      if (res.code === 200) {
        this.cameraPositions = res.data.cameraPositions
      }

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
      const { latitude, longitude, openId } = this
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
        const that = this
        uni.setStorageSync('token', res.data.token)
        uni.showToast({
          title: '登录成功',
          duration: 2000,
          success: function() {
            that.init()
          }
        })
      }
    }
  },
  async onLoad(options) {
    try {
			await getLocation()
		} catch (error) {}
		this.latitude = uni.getStorageSync('latitude')
		this.longitude = uni.getStorageSync('longitude')
    this.id = options.id || ''
    this.queryScenicDetail()
    this.init()
    uni.login({
      success: res => {
        this.getOpenid(res.code)
      }
    })
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
  padding: 32upx 24upx 30upx 24upx;
  width: calc(100% - 48upx);
  height: 198upx;
  background: #FFF;

  .text {
    width: calc(100% - 268upx);
    .name {
      font-size: 34upx;
      font-weight: bold;
      line-height: 48upx;
    }
    .label-wrap {
      display: flex;
      margin-top: 10upx;

      .l {
        margin-right: 16upx;
        box-sizing: border-box;
        padding: 0 8upx;
        height: 32upx;
        font-size: 20upx;
        color: #FFF;
        background: #52C234;

        &:nth-of-type(2n) {
          color: #52C234;
          border: 1upx solid #52C234;
          background: #FFF;
        }
      }
    }
    .address {
      margin-top: 16upx;
      font-size: 24upx;
      line-height: 34upx;
      color: #666;
    }
  }

  .pic-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    width: 268upx;
    height: 198upx;

    .pic {
      position: absolute;
      top: 0;
      left: 0;
      width: 268upx;
      height: 198upx;
    }
    .icon {
      position: relative;
      width: 48upx;
      height: 48upx;
    }
    .value {
      position: relative;
      margin-top: 12upx;
      font-size: 20upx;
      line-height: 28upx;
      color: #666;
    }
  }

}

.other-wrap {
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