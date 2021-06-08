import { getUserInfo, register } from "@/api/index.js";
export const queryUserCard = {
	data() {
		return {}
	},
	methods: {
		async queryUserCard(object) {
			uni.showLoading({
				title: '请求中',
				mask: true
			})
			const productType = uni.getStorageSync('productType')
			const res = await getUserInfo({ productType })
			uni.hideLoading()
			if (res.code !== 200) {
				uni.removeStorageSync("token")
				return uni.showModal({
					title: '提示',
					content: '登录状态失效，是否前往登录？',
					confirmColor: "#52C234",
					success: function (res) {
						if (res.confirm) {
							if (object && object.redirect) {
								const redirect = encodeURIComponent(`${object.redirect}`)
                uni.redirectTo({
                  url: `/pages/quickLogin/index?redirect=${redirect}`
                })
							} else {
								uni.reLaunch({
									url: "/pages/quickLogin/index"
								})
							}
							
						} else if (res.cancel) {}
					}
				})
			}
			if(res.code === 200){
				if (res.data.vlogUserId) {
					object&&object.success&&object.success(res.data)
				} else {
					try {
						await this.register()
					} catch (error) {
						return uni.showModal({
							title: "提示",
							content: error,
							confirmColor: "#52C234",
							confirmText: '知道了',
							showCancel: false,
							success: (res) => {
								if(res.confirm){}
							}
						})
					}
					object&&object.success&&object.success(res.data)
				}
				object&&object.complete&&object.complete(res.data)
			}
		},
		// 注册VLog
		async register() {
			const res = await register()
			if (res.code !== 200) {
				throw res.msg
			}
		}
	}
}

