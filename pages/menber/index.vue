<template>
  <view>
    <view class="card-wrap-c">
      <view class="card-wrap">
        <view class="card">
          <view class="title-intro">
            <view class="title">{{productName}}</view>
            <view class="intro">{{title}}</view>
          </view>
          <view class="price"><text class="unit">￥</text>{{unitPrice}}</view>
        </view>
      </view>
    </view>
    
    <view class="other">
      <view class="title">购卡须知</view>
      <view>
        旅行社团队及婚纱摄影人员不得使用此类门票。
        该景区可能有存在高风险的游玩项目，携程建议您购买相关保险。出行前，建议您仔细阅读旅游安全的相关内容。抵达景区后，也请您不要忽略景区内的游玩提示或安全提示类信息。
        如果已经预订了世界之窗的门票，直接在景区内购买阿尔卑斯滑冰票只需要30元/人。
        阿尔卑斯冰雪世界拒绝如孕妇、身高1.1米以下儿童、60岁以上老人、骨质疏松者、高血压患者、心脏病患者、酒后人员及其他不适合参与本项目的人员入场，冰雪世界保留最终解释权；若消费者隐瞒相关情况导致意外发生，须自行承担所有责任。
        部分设施有身高及身体参玩要求，请游客视自身的健康状况斟酌参玩。
        旅行社团队及婚纱摄影人员不得使用此类门票。
        该景区可能有存在高风险的游玩项目，携程建议您购买相关保险。出行前，建议您仔细阅读旅游安全的相关内容。抵达景区后，也请您不要忽略景区内的游玩提示或安全提示类信息。
        如果已经预订了世界之窗的门票，直接在景区内购买阿尔卑斯滑冰票只需要30元/人。
        阿尔卑斯冰雪世界拒绝如孕妇、身高1.1米以下儿童、60岁以上老人、骨质疏松者、高血压患者、心脏病患者、酒后人员及其他不适合参与本项目的人员入场，冰雪世界保留最终解释权；若消费者隐瞒相关情况导致意外发生，须自行承担所有责任。
        部分设施有身高及身体参玩要求，请游客视自身的健康状况斟酌参玩。
        旅行社团队及婚纱摄影人员不得使用此类门票。
        该景区可能有存在高风险的游玩项目，携程建议您购买相关保险。出行前，建议您仔细阅读旅游安全的相关内容。抵达景区后，也请您不要忽略景区内的游玩提示或安全提示类信息。
        如果已经预订了世界之窗的门票，直接在景区内购买阿尔卑斯滑冰票只需要30元/人。
        阿尔卑斯冰雪世界拒绝如孕妇、身高1.1米以下儿童、60岁以上老人、骨质疏松者、高血压患者、心脏病患者、酒后人员及其他不适合参与本项目的人员入场，冰雪世界保留最终解释权；若消费者隐瞒相关情况导致意外发生，须自行承担所有责任。
        部分设施有身高及身体参玩要求，请游客视自身的健康状况斟酌参玩。
        旅行社团队及婚纱摄影人员不得使用此类门票。
        该景区可能有存在高风险的游玩项目，携程建议您购买相关保险。出行前，建议您仔细阅读旅游安全的相关内容。抵达景区后，也请您不要忽略景区内的游玩提示或安全提示类信息。
        如果已经预订了世界之窗的门票，直接在景区内购买阿尔卑斯滑冰票只需要30元/人。
        阿尔卑斯冰雪世界拒绝如孕妇、身高1.1米以下儿童、60岁以上老人、骨质疏松者、高血压患者、心脏病患者、酒后人员及其他不适合参与本项目的人员入场，冰雪世界保留最终解释权；若消费者隐瞒相关情况导致意外发生，须自行承担所有责任。
        部分设施有身高及身体参玩要求，请游客视自身的健康状况斟酌参玩。
      </view>
    </view>
    <view class="h100"></view>
    <view class="button-wrap">
      <view class="button" @tap="cardPayOpen">购买会员</view>
    </view>
    <uni-popup ref="cardPay" type="bottom">
			<view class="card-pay-dialog">
				<view class="title">{{productName}}</view>
				<view class="list">
					<text class="label">持卡人姓名</text>
          <input class="value" placeholder="请输入您的姓名" v-model="userName" />
				</view>
				<view class="list">
					<text class="label">身份证号</text>
          <input class="value" placeholder="请输入您的身份证号" v-model="idNum" @focus="idNumInput" />
				</view>
				<view class="list">
					<text class="label">合计应付</text>
					<view class="price">
						<text class="unit">¥</text>
						{{unitPrice}}
					</view>
				</view>
				<view class="rule">
					<text @tap="toSetRule" :class="[{ 'main-color': ruleFlag },'iconfont','icon']">
						<template v-if="ruleFlag">&#xe844;</template>
						<template v-else>&#xe77d;</template>
					</text>
					本人同意并接受以下协议<text class="main-color" @tap="toRead">《云谷智游Vlog产品说明》</text>
				</view>
				<view @tap="toOrder" class="b">
					立即支付
				</view>
			</view>
		</uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import {
  formatNum,
  formatDate,
  checkCardNo
} from '@/static/utils/tool'
import {
  getProductDetail,
  checkForBuyCard,
  postBuyCard,
  vlogCardPay,
  getOpenid
} from '@/api/index'
export default {
  data() {
    return {
      productId: '',
      productName: '',
      productDesc: '',
      unitPrice: '',
      title: '',
      userName: '',
      idNum: '',
      openId: '',
      idNumFlag: false,
      ruleFlag: false
    }
  },
  components: {
    uniPopup
  },
  methods: {
    // 获取卡信息
    async getProductDetail() {
      const { productId } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getProductDetail({ productId })
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
        this.productName = res.data.name
        this.productDesc = res.data.productDesc
        this.unitPrice = res.data.price
        this.title = res.data.title.length > 60 ? res.data.title.substring(0, 60) + "..." : res.data.title
      }
    },
    // 购卡弹起
    cardPayOpen() {
      this.$refs.cardPay.open()
    },
    // 证件号校验
    idNumInput() {
      this.idNumFlag = true
      this.idNum = ""
    },
    // 同意与否
    toSetRule() {
      this.ruleFlag = !this.ruleFlag;
    },
    // 去购卡
    toOrder() {
      if (this.userName === "") return uni.showToast({
        title: "请填写姓名",
        icon: "none"
      })
      if (this.idNumFlag && !checkCardNo(this.idNum)) return uni.showToast({
        title: "请填写有效的证件号",
        icon: "none"
      })
      if (!this.ruleFlag) return uni.showToast({
        title: "请同意协议",
        icon: "none"
      })
      this.checkForBuyCard()
    },
    // 购卡检查
    async checkForBuyCard() {
      const { productId } = this
      uni.showLoading({
        title: '校验中',
        mask: true
      })
      const res = await checkForBuyCard({ productId })
      uni.hideLoading()
      if (res.code !== 200 && res.code !== 408) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#52C234",
        confirmText: '知道了',
        showCancel: false,
        success: (res) => {
          if(res.confirm){}
        }
      })
      if (res.code == 408) {
        uni.showModal({
          content: res.msg,
          confirmColor: "#52C234",
          success: res => {
            if (res.confirm) {
              this.postBuyCard()
            }
          }
        })
      }
      if (res.code == 200) {
        this.postBuyCard()
      }
    },
    // 购卡
    async postBuyCard() {
      const { productId, userName, idNum } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await postBuyCard({ productId, userName, idNum })
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
				this.vlogCardPay(res.data)
			}
    },
    // 购卡微信支付
    async vlogCardPay(orderId) {
      const openId = this.openId
      const type = 'wxpay_notifyUrl'
      uni.showLoading({
        title: '支付调起中',
        mask: true
      })
      const res = await vlogCardPay({ openId, orderId, type })
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
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function(res) {
            uni.showModal({
              title: "提示",
              content: '购卡成功',
              confirmColor: "#52C234",
              confirmText: '去首页',
              success: (res) => {
                if(res.confirm){
                  uni.switchTab({
                    url: '/pages/index/index'
                  })
                }
              }
            })
          }
        })
      }
    },
    // 获取openid
    async getOpenid(loginCode) {
      const productType = uni.getStorageSync('productType')
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getOpenid({ loginCode, productType })
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
        this.openId = res.data.openid
      }
    },
    //去查看协议
    toRead() {
      uni.navigateTo({
        url: '/pages/agreement/index'
      })
    }
  },
  onShow() {
    uni.login({
      success: res => {
        this.getOpenid(res.code)
      }
    })
  },
  onLoad(options) {
    this.productId = options.productId || ''
    this.getProductDetail()
  }
}
</script>

<style lang="scss">
.card-wrap {
  overflow: hidden;
  padding-top: 30upx;
  background: #52C234;
  border-radius: 0 0 40% 40%;
  .card {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    box-shadow: 0px 2upx 21upx 0px rgba(255,149,8,0.2);
    border-radius: 20upx 20upx 0 0;
    padding: 20upx 24upx;
    width: calc(100% - 48upx - 48upx);
    height: 214upx;
    background: linear-gradient(135deg, #FFC713 0%, #FF9508 100%);

    .title {
      font-size: 40upx;
      font-weight: bold;
      line-height: 56upx;
    }
    .intro {
      font-size: 24upx;
      line-height: 33upx;
    }

    .price {
      font-size: 48upx;

      .unit {
        font-size: 24upx;
      }
    }
  }
}

.other {
  padding: 60upx 24upx;
  width: calc(100% - 48upx);
  font-size: 24upx;
  line-height: 48upx;
  color: #666;
  background: #FFF;

  .title {
    display: inline-block;
    position: relative;
    font-size: 32upx;
    font-weight: bold;
    line-height: 45upx;

    &::before {
      position: absolute;
      bottom: 5upx;
      left: 5upx;
      content: '';
      width: calc(100% - 10upx);
      height: 10upx;
      background: hsla(107, 58%, 48%, .8);
    }
  }
}


.button-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100upx;
  background: #FFF;
  box-shadow: 0px -2upx 20upx 0px rgba(201,201,201,0.5);


  .button {
    position: relative;
    border-radius: 40upx;
    width: 560upx;
    height: 80upx;
    font-size: 34upx;
    font-weight: bold;
    line-height: 80upx;
    text-align: center;
    color: #FFF;
    background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);
  }
}

.card-pay-dialog {
  padding: 10upx 0 60upx 0;
  border-radius: 30upx 30upx 0 0;
  background: #FFF;

  .title {
    border-bottom: 1upx solid #EEE;
    font-size: 32upx;
    font-weight: bold;
    line-height: 100upx;
    text-align: center;
  }

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1upx solid #EEE;
    padding: 0 24upx;
    width: calc(100% - 48upx);
    height: 100upx;
    line-height: 100upx;

    .label {
      width: 160upx;
      font-size: 28upx;
      font-weight: bold;
    }

    .value {
      width: calc(100% - 160upx);
      height: 100upx;
    }

    .price {
      font-size: 32upx;
      color: #FF3C1A;
      .unit {
        font-size: 24upx;
      }
    }
  }

  .rule {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 22upx;
    font-size: 24upx;

    .icon {
      margin-right: 10upx;
      font-size: 30upx;
      color: #999;

      &.main-color {
        color: #52C234;
      }
    }
  }

  .b {
    margin: 60upx auto 0 auto;
    border-radius: 44upx;
    width: 690upx;
    height: 88upx;
    font-size: 32upx;
    font-weight: bold;
    line-height: 88upx;
    text-align: center;
    color: #FFF;
    background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);
  }
}
</style>