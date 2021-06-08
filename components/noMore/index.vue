<template>
	<view class="noMore">
    <text class="baseline"></text>
      已经到底了
    <text class="baseline"></text>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.noMore {
	display: flex;
	justify-content: center;
	align-items: center;
  position: relative;
  padding: 60rpx 0;
  width: 100%;
	font-size: 24rpx;
	color: #999999;
}
.noMore .baseline {
	width: 80rpx;
	height: 1rpx;
	background: #EEE;
	margin: 0 17rpx;
}

</style>
