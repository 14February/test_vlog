<template>
	<view>
		<view class="">
			<view class="h100"></view>
			<view class="search">
				<view class="input"><text class="iconfont icon">&#xe63c;</text><input type="text" v-model="name" @input="getKeyword" @confirm="toScenic"></view>
				<text class="button" @tap="cancal">取消</text>
			</view>
			<view v-if="showSort" class="section">
			</view>
			<template v-else>
				<view class="section_">
					<no-content v-if="noContent">
						<view class="no_content">
							<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
							<view class="text">没有找到景区～</view>
						</view>
						
					</no-content>
					<template v-else>
						<view
							class="list"
							v-for="(item,index) in searchList"
							:key="index"
							@tap="toDetail(item)"
						>
							<view class="name_wrap nowrap">
								<text class="iconfont icon">&#xe63c;</text>
								<text class="name nowrap">{{item.name}}</text>
							</view>
							<view v-if="item.city" class="address">
								<text>{{item.city}} | {{item.distance|distanceFormat}}</text>
								<text class="iconfont icon">&#xe682;</text>
							</view>
						</view>
					</template>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import {
  checkLogin
} from '@/static/utils/checkLogin'
import {
  queryUserCard
} from '@/static/utils/queryUserCard'
import noContent from '@/components/noContent/index.vue'
import {
	queryScenicList
} from "@/api/index"
import {
	getLocation
} from '@/static/utils/tool'
export default {
	data() {
		return {
			searchList: [],
			sortList: [],
			name: "",
			showSort: true,
			noContent: false,
			toScenicId: '',
			latitude: '',
			longitude: ''
		}
	},
	mixins: [checkLogin, queryUserCard],
	components: {
		noContent
	},
	methods: {
		cancal() {
			const pages = getCurrentPages();
			if(pages.length > 1){
				uni.navigateBack()
			}else{
				uni.switchTab({
					url: "/pages/home/index"
				})
			}
		},
		// 去景区列表
		toScenic() {
			if (this.noContent) return
			const { scenicName } = this
			uni.redirectTo({
					url: `/pages/scenic/scenic?scenicName=${scenicName}`
			})
		},
		//去景区详情
		toDetail(options) {
			// this.$store.commit('getScenicInfo', item)
			uni.navigateTo({
				url: `/pages/scenicDetail/index?id=${options.id}`
			})
		},
		//获取关键字
		getKeyword(e) {
			if (this.scenicName == "") {
				this.showSort = true
			} else {
				this.queryScenicList()
			}
		},
		//清空
		quit() {
			this.showSort = true;
		},
		//获取搜素推荐
		async getSearchSortList() {
			const pageNo = 1
			const pageSize = 20
			const { lat, lon } = this
			const res = await queryScenicList({ pageNo, pageSize, lat, lon })
			if (res.code == 200) {
				this.sortList = res.data.list;
			}
		},
		//获取搜索列表
		async queryScenicList() {
			uni.showLoading({
				title: "加载中…",
				icon: "none"
			})
			const pageNo = 1
			const pageSize = 20

			const { lat, lon, name } = this
			const res = await queryScenicList({ pageNo, pageSize, lat, lon, name })
			uni.hideLoading();
			if (res.code == 200) {
				this.showSort = false
				if (res.data.total == 0) {
					this.noContent = true
					this.searchList = []
				} else {
					this.noContent = false
					this.searchList = res.data.list
				}
			}
		}
	},
	onLoad() {
		this.lat = uni.getStorageSync('latitude')
		this.lon = uni.getStorageSync('longitude')
		this.getSearchSortList()
	}

}
</script>

<style lang="scss" scoped>

.h100 {
	height: 100upx;
}
.search {
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	padding: 0 30upx;
	width: calc(100% - 60upx);
	height: 100upx;
	font-size: 28upx;
	background: #FFF;

	.input {
		display: flex;
		align-items: center;
		border-radius: 40px;
		padding: 0 20upx;
		width: calc(604upx - 40upx);
		height: 80upx;
		background: #F7F7F7;
		
		.icon {
			width: 42upx;
			height: 42upx;
		}
		input {
			width: calc(100% - 42upx);
		}
	}

	.button {
		width: calc(100% - 604upx);
		line-height: 80upx;
		text-align: center;
		color: #999;
	}
}

.section {
	margin-top: 30upx;
	padding: 0 30upx;
	width: calc(100% - 30upx);
	
	.title {
		font-size: 28upx;
		font-weight: bold;
		line-height: 40upx;
	}

	.lists {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20upx;
		font-size: 28upx;

		.list {
			margin-right: 30upx;
			margin-bottom: 30upx;
			padding: 0 20upx;
			height: 68upx;
			line-height: 68upx;
			background: #F7F7F7;

			&:nth-last-of-type(1) {
				margin-right: 0;
			}
		}

	}
}

.section_ {
	.list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 50upx;
		padding: 0 30upx;
		width: calc(100% - 60upx);
		height: 40upx;
		font-size: 28upx;


		.name_wrap {
			flex: 0 1 auto;
			display: flex;
			align-items: center;

			.icon {
				flex: 0 0 auto;
				margin-right: 10upx;
				width: 30upx;
				height: 30upx;
				line-height: 30upx;
				font-size: 28upx;
			}
			.name {
				font-weight: bold;
			}
		}

		.address {
			flex: 0 0 auto;
			display: flex;
			align-items: center;
			margin-left: 30upx;
			color: #999999;
			.icon {
				font-size: 28upx;
			}
		}
	}
}

.no_content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 156upx;
	
	.pic {
		width: 288upx;
	}

	.text {
		margin-top: 20upx;
		font-size: 28upx;
		line-height: 48upx;
		color: #999;
	}
}
</style>
