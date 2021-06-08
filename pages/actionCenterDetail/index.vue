<template>
  <view>
    <view class="h">{{slideTitle}}</view>
    <view class="p">
      {{browse}}浏览｜{{createTime}}
    </view>
    <view class="s">
      <rich-text :nodes="slideDetails"></rich-text>
    </view>
  </view>
</template>

<script>
import {
  getActivityInfo
} from '@/api/index'
export default {
  data() {
    return {
      slideId: '',
      slideTitle: '',
      slideDetails: '',
      createTime: '',
      browse: ''
    }
  },
  methods: {
    async getActivityInfo() {
      const { slideId } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getActivityInfo({ slideId })
      uni.hideLoading()
      if (res.code !== 200) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#FF802B",
        confirmText: '返回上页',
        showCancel: false,
        success: (res) => {
          if(res.confirm){
            uni.navigateBack()
          }
        }
      })
      if (res.code === 200) {
        this.slideTitle = res.data.slideTitle
        this.slideDetails = this.replaceDetail(res.data.slideDetails)
        this.createTime = res.data.createTime
        this.browse = res.data.browse
        uni.setNavigationBarTitle({title: res.data.slideTitle})
      }
    },
    // 富文本转换
    replaceDetail(details){
      var texts='';//待拼接的内容
      while(details.indexOf('<img')!=-1){//寻找img 循环
        texts+=details.substring('0',details.indexOf('<img')+4);//截取到<img前面的内容
        details = details.substring(details.indexOf('<img')+4);//<img 后面的内容
        if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
          texts+=details.substring(0,details.indexOf('style="')+7)+"max-width:100%;height:auto;margin:0 auto;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
          details=details.substring(details.indexOf('style="')+7); //style后面的内容拼接
        }else{
          texts+=' style="max-width:100%;height:auto;margin:0 auto;" ';
        }		
      }
      texts+=details;//最后拼接的内容
      return texts
    }
  },
  onLoad(options) {
    console.log(options)
    this.slideId = options && options.slideId ? options.slideId : ''
    
    this.getActivityInfo()
  }
}
</script>

<style lang="scss">
.h {
  padding: 40upx 24upx 0 24upx;
  font-size: 60upx;
  font-weight: bold;
  line-height: 84upx;
}

.p {
  margin-top: 20upx;
  padding: 0 24upx;
  width: calc(100% - 48upx);
  font-size: 24upx;
  line-height: 33upx;
  color: #999;
}

.s {
  margin-top: 58upx;
  padding: 24upx;
  width: calc(100% - 48upx);
  font-size: 28upx;
  line-height: 48upx;
  color: #666666;
}
</style>