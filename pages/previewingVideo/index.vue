<template>
  <view>
    <view class="h20"></view>
    <template v-if="list.length">
    <view class="list" v-for="(item,index) in list" :key="item.orderId" @tap="toScenicVideo(item)">
      <view class="progress-wrap">
        <progress class="progress" :key="item.orderId" :percent="item.percent" activeColor="#64E38B" backgroundColor="#FFF" active active-mode="forwards" stroke-width="4" border-radius="8" />
      </view>
      <image class="pic" :src="item.thumbImageUrl" mode="aspectFill" @error="imageErrorCallback(index)" />
      <view class="text">
        <view class="name">{{item.scenicName}}</view>
        <view class="duration">时长：{{item.duration|durationFormat}}</view>
        <view class="mark">
          <template v-if="item.status !== 'done'">视频生成中，稍等1分钟获取视频…</template>
        </view>
        <view v-if="item.status === 'done'" class="button">前往下载</view>
        <view v-else class="button">视频合成中</view>
      </view>
    </view>
    </template>
    <noContent v-else>
			<view class="no-content">
				<image class="pic" :src="'vlog/default/noProduct.png'|imgUrlFormat" mode="widthFix" />
				<view class="text">视频生成中，点击按钮获取预览视频~</view>
        <view class="button" @tap="queryVlog">获取景点视频</view>
			</view>
		</noContent>
  </view>
</template>

<script>
import noContent from '@/components/noContent/index.vue'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import { queryVlog } from '@/api/index'
export default {
  data() {
    return {
      query: {},
      caseId: '',
      jobId: '',
      list: [],
      time: 0,
      timer: '',
      frequency: 0,
      isAllDone: false
    }
  },
  components: {
    uniPopup
  },
  components: {
		noContent
	},
  methods: {
    imageErrorCallback(index) {
      this.list[index].vlogThumbImageUrl = '/static/images/default/video.png'
    },
    // 视频查询
		queryVlog() {
			const that = this
      const { caseId, jobId } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      try {
      this.timer = setInterval(async() => {
        console.log('预览列表请求中...')
        let res = null
        if (that.time < 20 && that.time % 5 === 0) {
          res = await queryVlog({ caseId, jobId })
        }
        if (that.time > 20 && that.time % 1 === 0) {
          res = await queryVlog({ caseId, jobId })
        }
        if (res && res.code !== 200) {
          clearInterval(that.timer)
          uni.hideLoading()
          return uni.showModal({
            title: "提示",
            content: res.msg,
            confirmColor: "#52C234",
            confirmText: '知道了',
            showCancel: false,
            success: (res) => {
              if(res.confirm){}
            }
          })
        }

        if (res && res.code === 200) {
          // 新旧数据同步
          if (res.data.length) uni.hideLoading()
          const list = JSON.parse(JSON.stringify(this.list))
          const frequency = this.frequency
          res.data.forEach(item => {
            // 旧数据在之前基础累加，且在最高进度之前，否则进度不变；新数据则直接变更为当前次数应该进度；状态为done情况下进度百分百
            const maxPercent = 85 // 最大进度
            const maxFrequency = 5 // 最多次数
            const random = (Math.random(1) * maxPercent / maxFrequency ) // 随机进度
            const a = list.find(c => {return c.orderId === item.orderId})
            item.thumbImageUrl = a && a.orderId ? a.thumbImageUrl : item.thumbImageUrl 
            // 缓存完成：100
            if (item.status == 'done') {
              item.percent = 100
            } else {
              // 大于5直接最大
              if (frequency > maxFrequency) {
                item.percent = maxPercent
              } else {
                if (a && a.percent) {
                  // 小于5且之前存在：当前进度 + 随机进度
                  item.percent = Math.floor(a.percent + random) >= maxPercent
                    ? maxPercent
                    : Math.floor(a.percent + random)
                } else {
                  // 小于5且不存在：基本进度 + 随机进度
                  item.percent = Math.floor((maxPercent * (frequency / maxFrequency)) + random) >= maxPercent
                    ? maxPercent
                    : Math.floor((maxPercent * (frequency / maxFrequency)) + random)
                }
              }
            }
          })
          this.list = res.data
          console.log(res.data[0].thumbImageUrl)
          this.isAllDone = res.data.length ? res.data.every(item => {return item.status == 'done' }) : false
          if (this.isAllDone) {
            clearInterval(that.timer)
          }
          that.frequency += 1
        }
        that.time += 1
        
      }, 1000);
      } catch (error) {
        console.log(error) 
      }
		},
    // 去下载
    toScenicVideo(item) {
      if (item.status !== 'done') {
        return uni.showToast({
          title: '视频合成中',
          icon: 'none'
        })
      }
      const { query } = this
      query.thumbImageUrl = item.thumbImageUrl
      query.productId = item.productId
      query.duration = item.duration
      query.videoUrl = item.videoUrl
      query.orderId = item.orderId
      console.log(query)
      this.$store.commit('getScenicInfo', {})
      this.$store.commit('getScenicInfo', query)
      const { caseId, jobId } = this
      uni.navigateTo({
        url: `/pages/scenicVideo/index?caseId=${caseId}&jobId=${jobId}`
      })
    }
  },
  onPullDownRefresh() {
    clearInterval(this.timer)
    this.queryVlog()
    //下拉的生命周期
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 500)
  },
  onHide() {
    this.time = 0
    this.frequency = 0
    this.isAllDone = false
    clearInterval(this.timer)
  },
  onUnload() {
    this.time = 0
    this.frequency = 0
    this.isAllDone = false
    clearInterval(this.timer)
  },
  onShow() {
    this.queryVlog()
  },
  onLoad(options) {
    const query = this.$store.state.scenicInfo
    this.query = query
    this.caseId = options && options.caseId ? options.caseId : ''
    this.jobId = options && options.jobId ? options.jobId : ''


    console.log(query,options)
  }
}
</script>

<style lang="scss">
page {
  background: #F6F6F6;
}
.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
  margin: 0 auto 20upx auto;
  border-radius: 16upx;
  padding: 32upx 24upx;
  width: calc(100% - 48upx - 24upx);
  background: #FFF;
  .progress-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgba($color: #000000, $alpha: .5);
    .progress {
      width: 100%;
    }
  }
  .pic {
    flex: 0 0 auto;
    border-radius: 8upx;
    width: 224upx;
    height: 224upx;
  }

  .text {
    width: calc(100% - 224upx - 34upx);

    .name {
      margin-bottom: 8upx;
      font-size: 28upx;
      font-weight: bold;
      line-height: 40upx;
    }

    .duration {
      margin-bottom: 8upx;
      font-size: 24upx;
      height: 34upx;
      line-height: 34upx;
      color: #666;
    }
    .mark {
      margin-bottom: 28upx;
      height: 34upx;
      font-size: 24upx;
      line-height: 34upx;
      color: #888;
    }
    .button {
      display: inline-block;
      border-radius: 28upx;
      padding: 0 32upx;
      height: 56upx;
      font-size: 28upx;
      line-height: 56upx;
      color: #FFF;
      background: #52C235;
    }
  }
}

.no-content .button {
  background: linear-gradient(270deg, #64E38B 0%, #52C234 100%);
}

</style>