<template>
	<view>
		<view class="section">
			<image v-for="(item,index) in productList" :key="index" mode="" :src="item.logoUrl|imgUrlFormat" @tap="toMember(item.productId)"></image>
		</view>
	</view>
</template>

<script>
import { getProductList } from "@/api/index.js"
export default {
	data() {
		return {
			productList:[]
		}
	},
	methods: {
		//去购卡
		toMember(id){
			uni.navigateTo({
				url: '../menber/index?productId=' + id
			})
		},
		async getProductList(){
			const type = wx.getStorageSync("productType")
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			const res = await getProductList({ type })
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
				this.productList = res.data
			}
		}
	},
	onLoad(){
		this.getProductList()
	}
}
</script>

<style lang="scss">
	.section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 20upx;
		image {
			margin-bottom: 10upx;
			border-radius: 16upx;
			width: calc(100% - 48upx);
			height: 420upx;
		}
	}
	
</style>
