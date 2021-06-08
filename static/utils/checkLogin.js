export const checkLogin = {
	data() {
		return {}
	},
	methods: {
		checkLogin(object) {
			if (!uni.getStorageSync('token')) {
				return uni.showModal({
          title: "提示",
          content: '您还未登录，是否前往登录？',
          confirmColor: "#52C235",
          confirmText: '去登录',
          success: (res) => {
            if(res.confirm){
              if (object && object.redirect) {
                uni.redirectTo({
                  url: `/pages/quickLogin/index?redirect=${encodeURIComponent(`/${object.redirect}`)}`
                })
              } else {
                uni.redirectTo({
                  url: '/pages/quickLogin/index'
                })
              }
            }
          }
        })
			}else{
				object && object.success && object.success()
			}
		}
	}
}
