<template>
  <view>
    <tabs :type="tabList" v-model="tabCurrent" itemColor="#52C235" lineColor="#52C235"/>
    <view class="h120"></view>
    <template v-if="!noContent">
    <view class="list" v-for="(item,index) in list" :key="item.orderId" @tap="toDetail(item)">
      <image class="pic" :src="item.fixThumbImageUrl" mode="aspectFill" @error="imageErrorCallback(index)"/>
      <view class="text">
        <view class="name nowrap">{{item.scenicName}}</view>
        <view class="date nowrap">{{item.createTime|dateFormat('YYYY-MM-DD hh-mm-ss')}}</view>
        <view class="tools">
          <view class="button">{{payStatus === 0 ? '前往支付' : '预览' }}</view>
        </view>
      </view>
		</view>
    <no-more v-if="!loadMoreFlag" />
    </template>
    <noContent v-else>
			<view class="no-content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">暂无订单~</view>
			</view>
		</noContent>
  </view>
</template>

<script>
import tabs from '@/components/tabs/index.vue'
import noMore from '@/components/noMore/index.vue'
import noContent from '@/components/noContent/index.vue'
import {
  queryOrderList
} from '@/api/index'
import {
  checkLogin
} from '@/static/utils/checkLogin'
export default {
  data() {
    return {
      tabList: [
        {
          label: '已支付',
          value: 1
        },
        {
          label: '未支付',
          value: 0
        }
      ],
      tabCurrent: 0,
      list: [{}],
			pageNo: 1,
			pageSize: 10,
			loadMoreFlag: true,
			noContent: true
    }
  },
  mixins: [checkLogin],
  components: {
    tabs,
    noMore,
    noContent
  },
  computed: {
    payStatus() {
      return this.tabList[this.tabCurrent].value
    }
  },
  watch: {
    payStatus() {
      this.orderInit()
      this.queryOrderList()
    }
  },
  methods: {
    imageErrorCallback(index) {
      this.list[index].vlogThumbImageUrl = '/static/images/default/video.png'
    },
    orderInit() {
      this.pageNo = 1
      this.list = []
      this.loadMoreFlag = true
			this.noContent = true
    },
    // 订单列表
    async queryOrderList() {
      const { pageNo, pageSize, payStatus } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await queryOrderList(pageNo, pageSize, { payStatus })
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
        if (res.data.list.length < pageSize) this.loadMoreFlag = false
				this.noContent = res.data.total == 0 ? true : false
				this.list = this.list.concat(res.data.list)
      }
    },
    toDetail(item) {
      uni.navigateTo({
        url: `/pages/orderDetail/index?orderId=${item.orderId}`
      })
    }
  },
  onReachBottom() {
		if (!this.loadMoreFlag) return
		this.pageNo++
		this.queryOrderList()
	},
  onShow() {
    this.checkLogin({
      success: () => {
        this.orderInit()
        this.queryOrderList()
      }
    })
  }
}
</script>

<style lang="scss">
page {
  background: #F6F6F6;
}
tabs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 20upx;
  padding: 32upx 24upx;
  width: calc(100% - 48upx - 48upx);
  background: #FFF;

  .pic {
    border-radius: 8upx;
    width: 224upx;
    height: 224upx;
  }

  .text {
    width: calc(100% - 224upx - 34upx);

    .name {
      font-size: 28upx;
      line-height: 40upx;
    }

    .date {
      margin-top: 8upx;
      font-size: 24upx;
      line-height: 34upx;
      color: #666;
    }
    .tools {
      display: flex;
      margin-top: 70upx;

      .button {
        border-radius: 28px;
        padding: 0 60upx;
        height: 56upx;
        font-size: 28uxp;
        line-height: 56upx;
        color: #FFF;
        background: #52C235;
      }
    }
    
  }

}
</style>