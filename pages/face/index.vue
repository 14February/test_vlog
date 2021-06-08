<template>
  <view>
    <canvas 
      canvas-id="canvas"
      id="canvas"
      :style="{'width': targetWidth + 'px','height': targetHeight + 'px'}"
      class="canvas"
      onTouchStart="log"
      onTouchMove="log"
      onTouchEnd="log"
    />
    <view class="h100"></view>
    <template v-if="faceSwitch">
    <view class="pic-wrap">
      <image v-if="!taking" class="pic" :src="src" mode=""/>
      <template v-else>
      <camera class="camera" device-position="front" flash="off" @error="error"></camera>
      <view class="mark">
        <text class="label">请正对镜头</text>
        <text class="value">{{time}}</text>
      </view>
      </template>
      <image class="j tl" src="/static/images/face/j.png" mode="" />
      <image class="j tr" src="/static/images/face/j.png" mode="" />
      <image class="j bl" src="/static/images/face/j.png" mode="" />
      <image class="j br" src="/static/images/face/j.png" mode="" />
      <view :class="['b',{'active': taking }]"></view>
      
    </view>
    <view class="p">请确认由本人亲自操作；</view>
    <view class="p">请按提示完成动作</view>
    </template>
    <view class="button-wrap">
      <image class="b" :src="'vlog/face/banner.png'|imgUrlFormat" mode="" />
      <view v-if="faceSwitch" class="button" @tap="toTake">请重新扫描</view>
      <view v-else class="button" @tap="chooseImg">请重新扫描</view>
    </view>
  </view>
</template>
<script>
import {
  checkLogin
} from '@/static/utils/checkLogin'
import {
  queryUserCard
} from '@/static/utils/queryUserCard'
import {
  checkUserCard
} from '@/static/utils/checkUserCard'
import {
  createVlog,
  queryVlog,
  checkFaceSwitch
} from '@/api/index'
export default {
  data() {
    return {
      src: '',
      taking: false,
      timer: '',
      time: 3,
      caseId: '',
      query: '',
      faceSwitch: false,
      queryTimer: '',
      queryTime: 0,
      targetWidth: 1000,
      targetHeight: 1000,
      dataURL: '',
      isGo: false
    }
  },
  mixins: [checkLogin, queryUserCard, checkUserCard],
  methods: {
    chooseImg(type) {
      let that = this
      this.checkLogin({
        success: () => {
          this.queryUserCard({
            success: (res) => {
              uni.chooseImage({
                count: 1, //默认9
                success: function (res) {
                  that.urlTobase64(res.tempFilePaths[0])
                }
              })
            }
          })
        }
      })
    },
    // 拍照初始化
    cameraInit() {
      this.src = '',
      this.taking = false
      this.time = 3
      clearInterval(this.timer)
    },
    // 拍照上传识别
    toTake() {
      const that = this
      if (this.taking) return
      this.time = 3
      this.taking = true
      this.timer = setInterval(() => {
        that.time--
        if (that.time <=0) {
          clearTimeout(that.timer)
          const ctx = uni.createCameraContext()
          ctx.takePhoto({
            quality: 'high',
            success: (res) => {
              that.src = res.tempImagePath
              that.taking = false
              setTimeout(() => {
                that.urlTobase64(res.tempImagePath)
              }, 500)
                
            },
            fail: () => {
              that.cameraInit()
            }
          })
        }
      },1000)
    },
    //图片转base64
    async urlTobase64(url) {
      let that = this
      uni.getImageInfo({
        src: url,
        success: function (image) {
          console.log(image)
          console.log('old',uni.getFileSystemManager().readFileSync(image.path, "base64"))
          // 图片原始尺寸
          const originWidth = image.orientation !== 'left' && image.orientation !== 'right' ? image.width :  image.height
          const originHeight = image.orientation !== 'left' && image.orientation !== 'right' ? image.height :  image.width
          // 最大尺寸限制
          const maxWidth = 1000
          const maxHeight = 1000
          // 目标尺寸
          let targetWidth = 0
          let targetHeight = 0
          // 图片尺寸超过400x400的限制
          if (originWidth > maxWidth || originHeight > maxHeight) {
            targetWidth = maxWidth
            targetHeight = maxHeight
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetHeight = Math.round(targetWidth * originHeight / originWidth)
            } else {
              targetWidth = Math.round(targetHeight * originWidth / originHeight)
            }
          } else {
            that.createVlog(uni.getFileSystemManager().readFileSync(image.path, "base64"))
            return
          }
          that.targetWidth = targetWidth
          that.targetHeight = targetHeight
          const ctx = uni.createCanvasContext('canvas',that)
          ctx.drawImage(url,0, 0, targetWidth, targetHeight)
          ctx.draw(false,function() {
            uni.canvasToTempFilePath({
              canvasId: 'canvas',
              width: targetWidth,
              height: targetHeight,
              destWidth: targetWidth,
              destHeight: targetHeight,
              success: function(res) {
                console.log(targetWidth,targetHeight)
                console.log(res.tempFilePath)
                that.createVlog(uni.getFileSystemManager().readFileSync(res.tempFilePath, "base64"))
              },
              fail: function(err) {
                console.log(err)
                // canvas导出图片失败
                uni.showModal({
                  title: '提示',
                  content: '图片导出失败',
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#2AC5F1',
                  success: function (res) {
                  if (res.confirm) {}
                  }
                })
              }
            },ctx)
          })
        }
      })
    },
    // 创建视频
    async createVlog(faceImg) {
      const { caseId } = this
      console.log('new',faceImg)
      uni.showLoading({
        title: '创建视频',
        mask: true
      })
      const res = await createVlog(caseId, { faceImg })
      if (res.code !== 200) {
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
      if (res.code === 200) {
        this.queryVlog(caseId, res.data)
      }
    },
    // 拍照开关
    async checkFaceSwitch() {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await checkFaceSwitch()
      uni.hideLoading()
      if (res.code === 200) {
        this.faceSwitch = res.data
      }
    },
    // 视频查询
		queryVlog(caseId, jobId) {
      const that = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      this.queryTimer = setInterval(async () => {
        console.log('查询视频列表请求中...')
        let res = null
        if (that.queryTime < 20 && that.queryTime % 5 === 0) {
          res = await queryVlog({ caseId, jobId })
        }
        if (that.queryTime >= 20 && that.queryTime % 1 === 0) {
          res = await queryVlog({ caseId, jobId })
        }
        
        if (res && res.code !== 200) {
          uni.hideLoading()
          that.queryTime = 0
          clearInterval(that.queryTimer)
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
        console.log(res && res.code === 200 && res.data.length)
        if (res && res.code === 200 && res.data.length) {
          uni.hideLoading()
          that.queryTime = 0
          clearInterval(that.queryTimer)
          that.$store.commit('getScenicInfo', this.query)
          if (!that.isGo) {
            uni.navigateTo({
              url: `/pages/previewingVideo/index?caseId=${caseId}&jobId=${jobId}`
            })
            that.isGo = true
          }
        }
      }, 1000)
    }
  },
  onShow() {
    this.isGo = false
    this.cameraInit()
  },
  onHide() {
    clearInterval(this.queryTimer)
  },
  onUnload() {
    clearInterval(this.queryTimer)
  },
  onLoad() {
    const query = this.$store.state.scenicInfo
    this.query = query
    this.caseId = query.exScenicId || ''
    this.checkFaceSwitch()
  }
}
</script>
<style lang="scss">
@keyframes myfirst
{
  0% {height: 0;}
  100% {height: 100%;background-color: linear-gradient(180deg, #52C234 100%, rgba(138, 227, 100, 0) 0%);}
}
.pic-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 auto;
  margin-bottom: 48upx;
  width: 512upx;
  height: 512upx;
  
  
  .b {
    position: absolute;
    top: 0;
    width: 100%;
    background: linear-gradient(180deg, rgba(138, 227, 100, 0) 0%, #52C234 100%);
    opacity: 0.3;
    height: 0;
    &.active {
      animation: myfirst 2s;
      animation-iteration-count: infinite;
    }
  }

  .pic {
    width: 418upx;
    height: 418upx;
    background-image: url('https://cdn-qn.cytsszt.com/vlog/face/face.png');
    background-size: 100% 100%;
  }

  .camera {
    width: 505upx;
    height: 505upx;
  }
  
  .mark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #FFF;
    .label {
      font-size: 28upx;
      line-height: 44upx;
    }

    .value {
      line-height: 50upx;
      font-size: 44upx;
      font-weight: bold;
    }
  }

  .j {
    position: absolute;
    width: 96upx;
    height: 96upx;

    &.tl {
      top: 0;
      left: 0;
    }
    &.tr {
      transform: rotate(90deg);
      top: 0;
      right: 0;
    }

    &.bl {
      transform: rotate(-90deg);
      bottom: 0;
      left: 0;
    }

    &.br {
      transform: rotate(180deg);
      bottom: 0;
      right: 0;
    }
  }
}

.p {
  text-align: center;
  font-size: 28upx;
  line-height: 40upx;
  color: #666;
}

.button-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 420upx;

  .b {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .button {
    position: relative;
    border-radius: 40upx;
    margin-bottom: 90upx;
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

.canvas {
  position: absolute;
  top: -99999px;
  left: -99999px;
}
</style>