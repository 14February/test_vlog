<template>
  <view>
    <view class="h15"></view>
    <view class="menu">
      <text class="label">个人头像</text>
      <view class="value">
        <open-data type="userAvatarUrl"></open-data>
      </view>
    </view>
    <view class="lists">
      <view class="list">
        <text class="label">姓名</text>
        <view class="value">
          <open-data class="name" type="userNickName"></open-data>
          <text class="iconfont icon">&#xe682;</text>
        </view>
      </view>
      <!-- <view class="list">
        <text class="label">性别</text>
        <view class="value">
          <template v-if="sex === 1">女</template>
          <template v-else>男</template>
          <text class="iconfont icon">&#xe682;</text>
        </view>
      </view> -->
      <view class="list">
        <text class="label">身份证</text>
        <view class="value">
          {{idNum||'暂未绑定'}}
          <text class="iconfont icon">&#xe682;</text>
        </view>
      </view>
    </view>
    <view class="lists">
      <view class="list">
        <text class="label">手机号</text>
        <view class="value">
          {{phone}}
          <text class="iconfont icon">&#xe682;</text>
        </view>
      </view>
    </view>
    <view class="button" @tap="signOut">退出登陆</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      sex: '',
      idNum: '',
      phone: '',
    }
  },
  methods: {
    signOut() {
      uni.showModal({
        title: "提示",
        content: '确认退出？',
        confirmColor: "#52C235",
        success: (res) => {
          if(res.confirm){
            uni.removeStorageSync('token')
            uni.reLaunch({
              url: '/pages/quickLogin/index'
            })
          }
        }
      })
    }
  },
  onLoad(options) {
    const query = JSON.parse(options.query)
    this.name = query.name
    this.sex = query.sex
    this.idNum = query.idNum
    this.phone = query.phone.substring(0, 3) + '****' + query.phone.substring(7)
  }
}
</script>

<style lang="scss">
page {
  background: #F7F7F7;
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  border-radius: 16upx;
  border-bottom: 1upx solid #EEE;
  padding: 0 24upx;
  width: calc(100% - 48upx - 48upx);
  height: 160upx;
  font-size: 30upx;
  background: #FFF;

  .value {
    overflow: hidden;
    border-radius: 50%;
    width: 112upx;
    height: 112upx;
  }
}

.lists {
  margin: 0 auto;
  margin-top: 20upx;
  border-radius: 16upx;
  padding: 0 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1upx solid #EEE;
    width: calc(100% - 24uxp);
    height: 112upx;
    font-size: 30upx;

    &:nth-last-of-type(1) {
      border-bottom: none;
    }

    .value {
      font-size: 28upx;
      color: #999;
      .icon {
        font-size: 30upx;
      }
    }
  }
}

.button {
  margin: 0 auto;
  margin-top: 20upx;
  border-radius: 16upx;
  width: calc(100% - 48upx);
  height: 112upx;
  font-size: 30upx;
  font-weight: bold;
  line-height: 112upx;
  text-align: center;
  color: #999999;
  background: #FFFFFF;
}
</style>