<template>
	<view class="header-wrap">
		<view class="header container" :style="{'padding-top': menuButtonTop+'px','backgroundColor':bgColor}">
			<view class="inner" :style="{ 'height': menuButtonHeight+'px','line-height': menuButtonHeight + 'px'}">
				<text @tap="back" :style="[{'color': fontColor}]" class="iconfont back">&#xe681;</text>
				<view class="title" :style="[{'color': fontColor}]">
					<text>{{title}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: () => {
					return ""
				}
			},
			bgColor: {
				type: String,
				default: () => {
					return "transparent"
				}
			},
			fontColor: {
				type: String,
				default: () => {
					return "#fff"
				}
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				menuButtonHeight: 0,
				menuButtonTop: 0
			}
		},
		methods: {
			back() {
				const pages = getCurrentPages();
				if(pages.length > 1){
					uni.navigateBack();
				}else{
					uni.switchTab({
						url: "../../pages/home/index"
					})
				}
			}
		},
		mounted() {
			this.statusBarHeight = getApp().globalData.statusBar;
			this.menuButtonHeight = getApp().globalData.menuButtonHeight || this.statusBarHeight || 30;
			this.menuButtonTop = getApp().globalData.menuButtonTop || this.statusBarHeight || 20;
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 24upx;
		width: calc(100% - 48upx);
	}
	.header-wrap {
		color: #fff;

		.header {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			padding-bottom: 10upx;
			z-index: 9999;
			box-sizing: border-box;
		}

		.title {
			text-align: center;
			text {
				display: inline-block;
				width: 500upx;
				font-size: 36upx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}

		}

		.inner {
			position: relative;

			.back {
				position: absolute;
				left: 0;
				top: 0;
				font-weight: bold;
			}
		}
	}
</style>
