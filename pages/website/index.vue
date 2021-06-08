<template>
	<view>
		<web-view :src="webUrl"></web-view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      webUrl: ''
    }
  },
  onLoad(){
    this.webUrl = getApp().globalData.webviewUrl
  }
}
</script>