<template>
  <view class="">
    <view
      class="tab-bar"
    >
      <!-- mibutton按钮弧度边框 -->
			<!-- 正常tabbar -->
			<view
        class="navigator-wrap"
      >
        <image class="cc" src="/static/images/tabbar/bg.png" mode="" />
				<view
          class="navigator"
          v-for="(item, index) in tabList"
          :key="index"
          :style="{'width': tabBarWidth + 'px'}"
          :class="current == index ? 'on' : ''"
          @tap="switchTab(index)"
        >
					<image
            class="pic"
            :src="[current == index ? item.selectedIconPath : item.iconPath]"
          />
					<view
            class="text"
            :style="[current == index ? {'color': selectedColor} : {'color': color}]"
          >
            {{item.text}}
          </view>
				</view>
			</view>
			<!-- mibutton按钮 -->
      <image
        class="mid-button-pic"
        src="/static/images/tabbar/midButton.png"
        @tap="midBtnClick"
      />
      <view class="mid-button-text">获取视频</view>
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
  transPx
} from '@/static/utils/tool'
export default {
  mixins: [checkLogin, queryUserCard],
  computed: {
    tabBarWidth: function() {
      let windowWidth = transPx(750)
      try {
        const res = uni.getSystemInfoSync();
        windowWidth = res.windowWidth
      } catch (e) {}
      
      return this.midButton.width
      ? (windowWidth - this.midButton.width) / this.tabList.length
      : windowWidth / this.tabList.length
    },
    paddingBottom: function() {
      let paddingBottom = 0
      try {
        const res = uni.getSystemInfoSync();
        paddingBottom = res.model.indexOf('iPhone X') == '-1' ? 0 : 34
      } catch (e) {}
      return paddingBottom
    }
  },

  props: {
    color: {
      type: String,
      default: "#666666"
    },
		selectedColor: {
      type: String,
      default: "#52C234"
    },
    borderStyle: {
      type: String,
      default: "white"
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    midButtonBackgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    current: {
      type: [Number],
      default: 0
    }
  },
  data() {
    return {
      tabList: [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "/static/images/tabbar/tool00.png",
          "selectedIconPath": "/static/images/tabbar/tool00_.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/user/index",
          "iconPath": "/static/images/tabbar/tool01.png",
          "selectedIconPath": "/static/images/tabbar/tool01_.png",
          "text": "我的"
        }
      ],
      
      midButton: {
        "pagePath": "/pages/scenic/index",
        "iconPath": "/static/images/tabbar/midButton.png",
        "text": "获取视频",
        "width": "120",
        "height": "162",
        "iconWidth": "104"
      }

    }
  },
  methods: {
    switchTab(index) {
      uni.switchTab({
        url: this.tabList[index]['pagePath']
      })
    },
    midBtnClick() {
      uni.navigateTo({
        url: '/pages/scenic/index'
      })
    }
  },
  created() {
    this.midButton['width'] = transPx(this.midButton['width'])
    this.midButton['height'] = transPx(this.midButton['height'])
    this.midButton['iconWidth'] = transPx(this.midButton['iconWidth'])
  }
}
</script>

<style lang="scss">

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 30upx 30upx 30upx 0;
}

.navigator-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;

  .cc {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 108upx;
  }
}

.navigator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 108upx;

  .pic {
    width: 48upx;
    height: 48upx;
  }

  .text {
    margin-top: 8upx;
    font-size: 20upx;
    line-height: 28upx;
  }
}

.mid-button-border {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: calc(((108upx - 48upx - 28upx - 8upx) / 2) + 28upx + 8upx);
  border-radius: 50%;
  box-shadow: 0upx 2upx 6upx 0upx rgba(0,0,0,0.1);
  background: #FFF;
}
.mid-button-pic {
  flex: 0 0 auto;
  position: absolute;
  right: 0;
  left: 0;
  margin: 0 auto;
  bottom: calc(((108upx - 48upx - 28upx - 8upx) / 2) + 28upx + 8upx);
  box-sizing: border-box;
  border-radius: 50%;
  width: 110upx;
  height: 110upx;
  text-align: center;
  z-index: 999999999999999;
  
}
.mid-button-text {
  position: absolute;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 999999999999999;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 8upx;
  font-size: 20upx;
  line-height: 28upx;
  color: #666666;
}
.mid-button {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  position: absolute;
  z-index: 999;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 50% 50% 0 0;
  padding-bottom: calc((108upx - 48upx - 28upx - 8upx) / 2);
  height: 108upx;
  .text {
    margin-top: 8upx;
    font-size: 20upx;
    line-height: 28upx;
  }
}
</style>