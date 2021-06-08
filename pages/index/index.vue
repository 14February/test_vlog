<template>
	<view>
		<view class="section">
			<view class="h30"></view>
			<view class="search-wrap" @tap="toSearch">
				<view class="city" @tap.stop="toCitySelect">
					<text class="nowrap">{{province}}</text>
					<text class="iconfont icon">&#xe8ec;</text>
				</view>
				<view class="base"></view>
				<view class="search">
					<text class="iconfont icon">&#xe63c;</text>
					<input class="input" type="text" placeholder="输入景区名称" disabled>
				</view>
			</view>
			<swiper v-if="bannerList.length" class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in bannerList" :key="index" @tap="toSwiper(item)">
					<view class="swiper-item">
						<image :src="item.slideUrl|imgUrlFormat"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- <view class="tool-wrap">
				<view class="tool" @tap="toGuide">
					<image class="pic" src="/static/images/index/tool00.png" mode="" />
					<text class="text">导航导游</text>
				</view>
				<view class="tool" @tap="toTicketPay">
					<image class="pic" src="/static/images/index/tool01.png" mode="" />
					<text class="text">门票购买</text>
				</view>
				<view class="tool" @tap="toUpGrade">
					<image class="pic" src="/static/images/index/tool02.png" mode="" />
					<text class="text">年卡购买</text>
				</view>
				<view class="tool" @tap="toParking">
					<image class="pic" src="/static/images/index/tool03.png" mode="" />
					<text class="text">智慧停车</text>
				</view>
			</view> -->
			<view class="tool2-wrap">
				<view class="tool" @tap="toUser">
					<view class="text">
						<text class="title">我的VLOG</text>
						<text class="sub-title">查看我的足迹></text>
					</view>
					<image class="pic" src="/static/images/index/tool_00.png" mode="" />
				</view>
				<view class="tool" @tap="toFootprint">
					<view class="text">
						<text class="title">秀米</text>
						<text class="sub-title">旅游VLOG日常></text>
					</view>
					<image class="pic" src="/static/images/index/tool_01.png" mode="" />
				</view>
			</view>
			<view class="h30"></view>
		</view>
		<!-- 景区 -->
		<view  class="section-l">
			<view class="title-wrap">
				<view class="title">全部景区</view>
				<text class="more" @tap="toScenic">更多></text>
			</view>
			<template v-if="!noContent">
			<view class="list" v-for="item in scenicList" :key="item.id" @tap="toDetail(item)">
				<view class="text">
					<view class="name nowrap">{{ item.name }}</view>
					<view class="descri nowrap-double">{{ item.description }}</view>
					<view class="address"><text class="iconfont icon">&#xe790;</text><text class="nowrap">{{ item.address }}</text></view>
				</view>
				<image class="pic" :src="item.coverImgUrl" mode="" />
			</view>
			</template>
			<noContent v-else>
			<view class="no-content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">暂无景区~</view>
			</view>
		</noContent>
		</view>
		<!-- 活动 -->
		<view v-if="activityList.length" class="section-a">
			<view class="title-wrap">
				<view class="title">热门活动</view>
				<text class="more" @tap="toActionCenter">更多></text>
			</view>
			<view class="l" v-for="item in activityList" :key="item.slideId" @tap="toActionCenterDetail(item)">
				<view class="text">
					<view class="name nowrap">{{item.slideTitle}}</view>
					<view class="descri nowrap-double">{{item.slideDetails|introductionFormat}}</view>
					<view class="other">
						<text class="">{{item.browse}}浏览</text>
						<text class="base"></text>
						<text class="">{{item.createTime|dateFormat('YYYY-MM-DD')}}</text>
					</view>
				</view>
				<image class="pic" :src="item.slideUrl|imgUrlFormat" mode="aspectFill" />
			</view>
		</view>
		<logo />
		<view class="h200"></view>
		<tab-bar :current="tabBarCurrent" :midButtonBackgroundColor="midButtonBackgroundColor"/>
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
  checkUserCard
} from '@/static/utils/checkUserCard'
import {
	queryScenicList,
	getLocationProvince,
	getActivityList,
	slideShowView,
	getSlideShowList,
	checkFaceSwitch
} from '@/api/index'

import {
	getLocation
} from '@/static/utils/tool'

export default {
	data() {
		return {
			bannerList: [],
			tabBarCurrent: 0,
			midButtonBackgroundColor: '#F5F5F5',
			province: '全部',
			lat: '',
			lon: '',
			scenicList: [],
			pageNo: 1,
			pageSize: 10,
			loadMoreFlag: true,
			noContent: true,
			activityList: [],
			faceSwitch: false
		}
	},
	mixins: [checkLogin, queryUserCard, checkUserCard],
	components: {
		noMore,
		noContent
	},
	methods: {
		//获取首页轮播图
		async getSlideShowList() {
			const productType = uni.getStorageSync("productType")
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			const res = await getSlideShowList({ productType })
			uni.hideLoading()
			if (res.code === 200) {
				this.bannerList = res.data
			}
		},
		// 轮播图跳转
		async toSwiper(option) {
			await slideShowView({
				slideId: option.slideId
			})
			// 文章详情
			if (1 == option.slideType) {
				return uni.navigateTo({
					url: `/pages/actionCenterDetail/index?slideId=${option.slideId}`
				});
			
			}
			// 跳转H5
			if (2 == option.slideType) {
				const url = option.slideDetails.replace(/\<\p\>/g, '').replace(/\<\/\p\>/g, '')
				getApp().globalData.webviewUrl = url
				return wx.navigateTo({
					url: '/pages/website/index'
				})
			}
		},
		// 景区列表
		async queryScenicList() {
			const { pageNo, pageSize, lat, lon } = this
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			const res = await queryScenicList({ pageNo, pageSize, lat, lon })
			uni.hideLoading()
			// if (res.code !== 200) return uni.showModal({
      //   title: "提示",
      //   content: res.msg,
      //   confirmColor: "#52C234",
      //   confirmText: '知道了',
      //   showCancel: false,
      //   success: (res) => {
      //     if(res.confirm){}
      //   }
      // })

			if (res.code === 200) {
				if (res.data.list.length < pageSize) this.loadMoreFlag = false
				this.noContent = res.data.total == 0 ? true : false
				this.scenicList = this.scenicList.concat(res.data.list)
			}
		},
		// 去我的
		toUser() {
			uni.switchTab({
				url: `/pages/user/index`
			})
		},
		// 去活动中心
		toActionCenter() {
			uni.navigateTo({
				url: '/pages/actionCenter/index'
			})
		},
		// 去活动详情
		async toActionCenterDetail(item) {
			await slideShowView({slideId: item.slideId})
			// 文章详情
			if(1 == item.slideType){
				return uni.navigateTo({
					url: `/pages/actionCenterDetail/index?slideId=${item.slideId}`
				})
			}
			// 跳转H5
			if(2 == item.slideType){
				const url = item.slideDetails.replace(/\<\p\>/g,'').replace(/\<\/\p\>/g,'')
				getApp().globalData.webviewUrl = url
				return wx.navigateTo({
					url: '/pages/website/index'
				})
			}
		},
		// 活动
		async getActivityList() {
			const pageNum = 1
			const pageSize = 2
			const productType = uni.getStorageSync('productType')
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			const res = await getActivityList({ pageNum, pageSize, productType })
			uni.hideLoading()
			if (res.code === 200) {
				this.activityList = res.data.list
			}
		},
		// 去详情
		toDetail(options) {
			// this.$store.commit('getScenicInfo', options)
			uni.navigateTo({
				url: `/pages/scenicDetail/index?id=${options.id}`
			})
		},
		// 去全部景区
		toScenic() {
			uni.navigateTo({
				url: '/pages/scenic/index'
			})
		},
		// 去选择城市
		toCitySelect() {
			uni.navigateTo({
				url: '/pages/citySelect/index'
			})
		},
		// 去搜索
		toSearch() {
			uni.navigateTo({
				url: '/pages/search/index'
			})
		},
		// 去导航导游
		toGuide() {
			uni.showToast({
				title: '暂未开放',
				icon: 'none'
			})
		},
		// 去购买门票
		toTicketPay() {
			uni.showToast({
				title: '暂未开放',
				icon: 'none'
			})
		},
		// 去年卡购买
		toUpGrade() {
			uni.showToast({
				title: '暂未开放',
				icon: 'none'
			})
		},
		// 去智慧停车
		toParking() {
			uni.showToast({
				title: '暂未开放',
				icon: 'none'
			})
		},
		// 去我的足迹
		toFootprint() {
			if (this.faceSwitch) {
				uni.showToast({
					title: '暂未开放',
					icon: 'none'
				})
			} else {
				this.toUser()
			}
			
		},
		//获取定位的省市
		async getLocationProvince() {
			const latitude = this.lat
			const longitude = this.lon
			if (!latitude && !longitude) return
			const res = await getLocationProvince({ latitude, longitude })
			this.province = res.code == 200 ? res.data.province : '全部'
			uni.setStorageSync('province',this.province)
		},
		// 拍照开关
		async checkFaceSwitch() {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			const res = await checkFaceSwitch()
			uni.hideLoading()
			if (res.code === 200) {
				this.faceSwitch = res.data
			}
		},
	},
	onReachBottom() {},
	onShow() {
		uni.hideTabBar()
	},
	async onLoad() {
		try {
			await getLocation()
		} catch (error) {}
		this.lat = uni.getStorageSync('latitude')
		this.lon = uni.getStorageSync('longitude')

		const province = uni.getStorageSync('province')
		if ( province && province !== '全部' ) {
			this.province = uni.getStorageSync('province')
		} else {
			await this.getLocationProvince()
		}
		this.getSlideShowList()
		this.queryScenicList()
		this.getActivityList()
		this.checkFaceSwitch()
	}
}
</script>

<style lang="scss">
page {
	background: #F5F5F5;
}



.section {
	padding: 0 24upx;
	width: calc(100% - 48upx);
	background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);
}
.search-wrap {
	display: flex;
	align-items: center;
	margin: 0 auto;

	margin-bottom: 16upx;
	border-radius: 36upx;
	height: 72upx;
	background: #F6F6F6;

	.city {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		padding: 0 30upx;
		max-width: 125upx;
		font-size: 28upx;

		.icon {
			flex: 0 0 auto;
			font-size: 32upx;
		}
	}
	.base {
		width: 1upx;
		height: 30upx;
		background: #999;
	}
	.search {
		display: flex;
		align-items: center;
		margin-left: 38upx;
		.icon {
			margin-right: 8upx;
			font-size: 32upx;
			color: #999;
		}
	}
}

.swiper {
	margin-bottom: 32upx;
	height: 234upx;

	.swiper-item {
		image {
			width: 100%;
			height: 234upx;
			border-radius: 8upx;
		}
	}
}

.tool-wrap {
	display: flex;
	margin-bottom: 32upx;

	.tool {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: calc(100% / 4);

		.pic {
			margin-bottom: 12upx;
			width: 112upx;
			height: 112upx;
		}

		.text {
			font-size: 24upx;
			line-height: 34upx;
		}
	}
}

.tool2-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.tool {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 16upx;
		width: 344upx;
		height: 160upx;
		background: #FFF;

		.text {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 24upx;

			.title {
				margin-bottom: 8upx;
				height: 40upx;
				font-size: 28upx;
				font-weight: bold;
				line-height: 40upx;
			}

			.sub-title {
				font-size: 20upx;
				line-height: 28upx;
				color: #999999;
			}
		}

		.pic {
			width: 144upx;
			height: 160upx;
		}
	}
}

.section-a {
	margin: 0 auto;
	margin-bottom: 30upx;
	border-radius: 16upx;
	padding: 36upx 24upx 0 24upx;
	width: calc(100% - 48upx - 48upx);
	background: #FFF;
	.title-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30upx;
		height: 48upx;

		.title {
			position: relative;
			font-size: 34upx;
			font-weight: bold;

			&::before {
				position: absolute;
				bottom: 5upx;
				left: 5upx;
				content: '';
				width: calc(100% - 10upx);
				height: 10upx;
				background: hsla(107, 58%, 48%, .8);
			}
		}
		.more {
			font-size: 28upx;
			color: #999999;
		}
	}

	.l {
		display: flex;
		justify-content: space-between;
		
		border-top: 1upx solid #EEE;
		padding: 28upx 0;
		.text {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: calc(100% - 208upx - 14upx);

			.name {
				margin-bottom: 8upx;
				font-size: 28upx;
				font-weight: bold;
				line-height: 40upx;
			}
			.descri {
				margin-bottom: 18upx;
				height: 56upx;
				font-size: 20upx;
				line-height: 28upx;
				color: #999;

			}
			.other {
				display: flex;
				align-items: center;
				height: 34upx;
				font-size: 20upx;
				color: #999;
			}
			.base {
				margin: 0 20upx;
				width: 1upx;
				height: 20upx;
				background: #999;
			}
		}
		.pic {
			border-radius: 8upx;
			width: 208upx;
			height: 156upx;
		}
	}
}

.section-l {
	margin: 0 auto;
	margin-bottom: 30upx;
	border-radius: 16upx;
	padding: 36upx 24upx;
	width: calc(100% - 48upx - 48upx);
	background: #FFF;

	.title-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48upx;

		.title {
			position: relative;
			font-size: 34upx;
			font-weight: bold;

			&::before {
				position: absolute;
				bottom: 5upx;
				left: 5upx;
				content: '';
				width: calc(100% - 10upx);
				height: 10upx;
				background: hsla(107, 58%, 48%, .8);
			}
		}
		.more {
			font-size: 28upx;
			color: #999999;
		}
	}
	.list {
		display: flex;
		justify-content: space-between;
		margin: 32upx auto;
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
}
</style>>
	