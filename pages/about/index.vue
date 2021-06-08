<template>
  <view class="">
    <view class="h150"></view>
    <view class="logo">
      <image class="pic" src="/static/images/user/logo.png" />
    </view>
    <view class="lists">
      <view class="list">
        <view class="label">公司名称</view>
        <view class="value">中青旅投资控股（深圳）有限公司</view>
      </view> 
      <view class="list">
        <view class="label">客服电话</view>
        <view class="value">0755-688-6578</view>
      </view> 
      <view class="list">
        <view class="label">地址</view>
        <view class="value">软件园基地5C栋702室整层</view>
      </view> 
    </view>
  </view>
</template>

<style lang="scss">
page {
  background: #F6F6F6;
}
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  .pic {
    width: 335upx;
    height: 61upx;
  }
}

.lists {
  margin: 0 auto;
  margin-top: 162upx;
  border-radius: 16upx;
  padding: 0 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1upx solid #EEE;
    width: calc(100% - 24upx);
    font-size: 34upx;
    height: 112upx;

    &:nth-last-of-type(1) {
      border-bottom: none;
    }

    .label {
      flex: 0 0 auto;
      font-weight: bold;
    }

    .value {
      flex: 0 1 auto;
      font-size: 28upx;
      color: #999;
    }
  }
}
</style>