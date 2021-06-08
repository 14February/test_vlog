<template>
  <view>
    <view class="h">{{articleTitle}}</view>
    <view class="p">
      <text class="">{{browse}}浏览｜{{createTime}}</text>
    </view>
    <view class="s">
      <rich-text :nodes="articleDetails"></rich-text>
    </view>
  </view>
</template>

<script>
import {
  getSysArticleDetail
} from '@/api/index'

export default {
  data() {
    return {
      articleId: '',
      articleTitle: '',
      articleDetails: '',
      createTime: '',
      browse: ''
    }
  },
  methods: {
    async getSysArticleDetail() {
      const { articleId } = this
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await getSysArticleDetail({ articleId })
      uni.hideLoading()
      if (res.code !== 200) return uni.showModal({
        title: "提示",
        content: res.msg,
        confirmColor: "#52C235",
        confirmText: '返回上页',
        showCancel: false,
        success: (res) => {
          if(res.confirm){
            uni.navigateBack()
          }
        }
      })
      if (res.code === 200) {
        this.articleTitle = res.data.articleTitle
        this.articleDetails = this.replaceDetail(res.data.articleDetails)
        this.createTime = res.data.createTime
        this.browse = res.data.browse
        uni.setNavigationBarTitle({title: '出游攻略'})
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
    this.articleId = options && options.articleId ? options.articleId : ''
    this.getSysArticleDetail()
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
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 20upx;
  padding: 0 24upx;
  width: calc(100% - 48upx);
  font-size: 24upx;
  height: 50upx;
  line-height: 50upx;
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