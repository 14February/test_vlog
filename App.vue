<script>
	import { getImgUrl } from "@/api/index"
	import { productType } from '@/config/index'
	export default {
		globalData: {
			imgUrl: '',
			webviewUrl: '',
			statusBar: 0,
			customBar: 0,
			menuButtonHeight: 0,
			menuButtonTop: 0,
			windowWidth: 0,
			statusBarHeight: 0,
			menuButtonWidth: 0,
			menuButtonLeft: 0,
		},
		methods: {
			async getImgUrl(){
				const res = await getImgUrl()
				if(res.code == 200){
					this.globalData.imgUrl = res.data
				}
			},
			UpdateManager() {
				const updateManager = uni.getUpdateManager();

				updateManager.onCheckForUpdate(function (res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
				});
				updateManager.onUpdateReady(function (res) {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});

				});

				updateManager.onUpdateFailed(function (res) {
					// 新的版本下载失败
				});
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			uni.hideTabBar()
			uni.setStorageSync('productType', productType)
			uni.getSystemInfo({
				success: (e) => {
					this.globalData.statusBar = e.statusBarHeight;
					// #ifndef MP
					this.globalData.statusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						this.globalData.customBar = 40;
					} else {
						this.globalData.customBar = 35;
					}
					// #endif

					// #ifdef MP-WEIXIN
					let custom = uni.getMenuButtonBoundingClientRect();
					this.globalData.menuButtonHeight = custom.height;
					this.globalData.menuButtonTop = custom.top;
					this.globalData.customBar = custom.height + this.globalData.statusBar/2;
					this.globalData.windowWidth = e.windowWidth
					this.globalData.statusBarHeight = e.statusBarHeight
					this.globalData.menuButtonWidth = custom.width
					this.globalData.menuButtonTop = custom.top
					this.globalData.menuButtonLeft = custom.left
					this.globalData.menuButtonRight = custom.right
					// #endif

					// #ifdef MP-ALIPAY
					this.globalData.customBar = e.statusBarHeight + e.titleBarHeight;
					// #endif


					

				}
			})




		},
		onShow: function() {
			console.log('App Show')
			this.getImgUrl()
			uni.hideTabBar()
			this.UpdateManager()
		},
		onHide: function() {
			console.log('App Hide')
		},
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/static/style/common.scss';

	@font-face {
		font-family: 'iconfont';  /* project id 2365216 */
		src: url('//at.alicdn.com/t/font_2365216_n331tgzvgu.eot');
		src: url('//at.alicdn.com/t/font_2365216_n331tgzvgu.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_2365216_n331tgzvgu.woff2') format('woff2'),
		url('//at.alicdn.com/t/font_2365216_n331tgzvgu.woff') format('woff'),
		url('//at.alicdn.com/t/font_2365216_n331tgzvgu.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_2365216_n331tgzvgu.svg#iconfont') format('svg');
	}
	.iconfont {
		font-family: 'iconfont';
		font-size: 34upx;
	}
</style>
