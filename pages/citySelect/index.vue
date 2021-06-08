<template>
	<view style="width: 100%;height: 100%;">
		<indexedList v-if="cityList.length" :options='cityList' v-on:list-click='selectCity'>
		<view id="hots" class="hots">
			<view class="title">
				<text>当前定位</text>
			</view>
			<view class="search-tag-wrap">
				<view class="search-tag" :data-city="city" @tap="selectCity(city)"><text class="iconfont icon">&#xe790;</text>{{city}}</view>
				<view @tap="getLocation" class="getLocation">重新获取</view>
			</view>
		</view>
		</indexedList>
	</view>
</template>

<script>
	import indexedList from '@/components/indexed-list/index.vue'
	import { getProvinceListByGroup, getLocationProvince } from "@/api/index"
	export default {
		data() {
			return {
				cityList: [],
				viewStr: "",
				city: ''
			};
		},
		components: {
			indexedList
		},
		methods: {
			selectCity(e){
				uni.setStorageSync('province', e)
				const routes = getCurrentPages()
				uni.reLaunch({
					 url: `/${routes[routes.length - 2].route}`
				})
			},
			locatAlert(){
				let that = this;
				uni.showModal({
					content: '检测到您没打开获取位置功能权限，是否去设置打开？',
					confirmText: "确认",
					cancelText: '取消',
					success: res => {
						if (res.confirm) {
							uni.openSetting({
								success: res => {

								}
							})
						} else {}
					}
				})
			},
			//重新获取定位
			getLocation(){
				uni.showLoading({
					title:"加载中……"
				})
				uni.authorize({
					scope: 'scope.userLocation',
					success: res => {
						uni.getLocation({
							type: 'wgs84',
							success: res => {
								this.getLocationProvince(res.latitude,res.longitude)
							},
							fail: err => {
								this.locatAlert()
							}
						})
					},
					fail: err => {
						this.locatAlert()
					},
					complete: err => {
						uni.hideLoading();
					}
				})
			},
			//获取定位的省市
			async getLocationProvince(latitude, longitude) {
				const data = {
					latitude: latitude,
					longitude: longitude
				}
				const res = await getLocationProvince(data);
				this.city = res.code == 200 ? res.data.province : '全部'
				
			},
			//获取城市列表
			async getProvinceListByGroup(){
				const res = await getProvinceListByGroup()
				if(res.code == 200){
					this.cityList = res.data
				}
			}
		},
		onLoad(options){
			this.city = uni.getStorageSync('province') || "未定位"
			this.getProvinceListByGroup()
			this.getLocation()
		}
	}
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
}
	.search-tag-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20upx;

		.icon {
			margin-right: 5upx;
			font-size: 28upx;
		}
	}
	scroll-view {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		height: 100%;
	}
	.title {
		padding-top: 10upx;
		font-weight: bold;
	}
	.location {
		margin-bottom: 20upx;
	}
	.hots {
		padding: 0 24upx;
		padding-bottom: 20upx;
		width: calc(100% - 48upx);
	}
	.getLocation {
		padding-right: 30upx;
		color: #FF802B;
	}
	.search-tag {
		display: flex;
		align-items: center;
		padding: 0 20upx;
		height: 68upx;
		background: #F7F7F7;
		.iconfont {
			margin-right: 10upx;
			font-size: 24upx;
		}
	}
	.city-wrap {
		.letter {
			margin-right: 60upx;
			padding-left: 30upx;
			height: 40upx;
			line-height: 40upx;
			background-color: #f7f7f7;
		}
		.city {
			padding: 0 60upx 0 30upx;
			font-size: 30upx;
			.item {
				border-bottom: 1upx solid #eee;
				height: 90upx;
				line-height: 90upx;
				&:nth-last-child(1) {
					border: none;
				}
			}
		}
	}
	.tool {
		position: fixed;
		right: 0;
		top: 10%;
		width: 60upx;
		font-size: 30upx;
		color: #999;
		text-align: center;
		
	}
</style>
