<template>
  <view class="container">
    <view class="h60"></view>
    <view class="sex_wrap">
      <view :class="['sex',{'active': sex === item.value}]" v-for="(item,index) in sexList" :key="item.value" @tap="sexChange(index)">
        <image class="pic" :src="item.picUrl" mode="" />
        <text class="text">{{item.label}}</text>
      </view>
    </view>
    <view class="list">
      <input class="input" type="text" placeholder="请输入姓名" v-model="name">
      <text v-if="name.length" class="iconfont icon" @tap="clear(0)">&#xe687;</text>
    </view>
    <view class="list">
      <input class="input" type="text" placeholder="请输入身份证号" v-model="idNum">
      <text v-if="idNum.length" class="iconfont icon" @tap="clear(1)">&#xe687;</text>
    </view>

    <view :class="[{'disabled': !name.length || !idNum.length},'button']" @tap="postUpdateCard">绑定</view>
  </view>
</template>

<script>
import {
  checkCardNo
} from "@/static/utils/tool"
import {
  postUpdateCard
} from '@/api/index'

import {
  checkLogin
} from '@/static/utils/checkLogin'

export default {
  data() {
    return {
      name: '',
      idNum: '',
      sexList: [
        {
          label: '男',
          value: 1,
          picUrl: '/static/images/card/sex00.png'
        },
        {
          label: '女',
          value: 2,
          picUrl: '/static/images/card/sex01.png'
        }
      ],
      sexIndex: 0,
      cardNum: ''
    }
  },
  mixins: [checkLogin],
  computed: {
    sex() {
      return this.sexList[this.sexIndex].value
    }
  },
  methods: {
    sexChange(index) {
      this.sexIndex = index
    },
    clear(index) {
      if (index === 0) {
        this.name = ''
      }
      if (index === 1) {
        this.idNum = ''
      }
    },
    // 激活卡片
    async postUpdateCard() {
      const { name, idNum, sex, cardNum } = this
      const productType = uni.getStorageSync("productType")
      if (!name.length || !idNum.length) return

      if(!checkCardNo(this.idNum))return uni.showToast({
        title: "请填写正确的证件号",
        icon: "none"
      })
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await postUpdateCard({ name, idNum, sex, productType })
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
      if (res.code === 200) {
        uni.showModal({
          title: "提示",
          content: '完善信息成功',
          confirmColor: "#52C234",
          confirmText: '去首页',
          showCancel: false,
          success: (res) => {
            if(res.confirm){
              uni.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
page {
  width: 100%;
}

.h60 {
  height: 60upx;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.list {
  display: flex;
  align-items: center;
  margin-bottom: 20upx;
  border-radius: 56upx;
  padding: 0 48upx;
  width: calc(100% - 96upx - 96upx);
  height: 112upx;
  background: #F5F5F5;

  .input {
    flex: 1 0 auto;
  }

  .icon {
    flex: 0 0 auto;
    padding-left: 10upx;
    color: #979797;
  }
}
.button {
  margin-top: 40upx;
  border-radius: 40upx;
  width: calc(100% - 96upx);
  height: 80upx;
  font-size: 34upx;
  font-weight: bold;
  line-height: 80upx;
  text-align: center;
  color: #FFF;
  background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);

  &.disabled {
    color: #999;
    background: #EEE;
  }
}

.sex_wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 40upx;
  width: calc(100% - 96upx);

  .sex {
    position: relative;
    padding: 15upx;
    width: 112upx;
    height: 112upx;
    

    .pic {
      width: 100%;
      height: 100%;
    }

    .text {
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: 50%;
      width: 32upx;
      height: 32upx;
      font-size: 20upx;
      line-height: 32upx;
      text-align: center;
      color: #FFF;
      background: #F5F5F5;
    }

    &.active {
      .text {
        background: #52C234;
      }
    }
  }
}
</style>
