<template>
	<view class="indexed-list" ref="list" id="list">
		<!-- 所有数据 -->
		<scroll-view :scroll-into-view="scrollViewId" class="indexed-list__scroll" scroll-y>
			<slot></slot>
			<view v-for="(list,index1) in lists" :key="index1" class="indexed-list__scroll-item" :id="'indexed-list-' + index1">
				<view class="indexed-list__scroll-title">
					{{list.letter}}
				</view>
				<view v-for="(item,index) in list.data" :key="index" class="indexed-list__scroll-content" @tap="listClick(item)">
					{{item}}
				</view>
			</view>
		</scroll-view>
		<!-- 索引值 -->
		<view :class="touchmove ? 'indexed-list__menu--active' : ''"  @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" class="indexed-list__menu">
			<view v-for="(list, key) in lists" :key="key" class="indexed-list__menu-item">
				<text class="indexed-list__menu-text" :class="touchmoveIndex == key ? 'indexed-list__menu-text--active' : ''">{{ list.letter }}</text>
			</view>
		</view>
		<!-- 索引触发效果 -->
		<view v-if="touchmove" class="indexed-list__alert-wrapper">
			<text class="indexed-list__alert">{{lists[touchmoveIndex].letter}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists: [],
				touchmove: false,
				itemHeight: 0,
				scrollViewId: '',
				touchmoveIndex: -1
			}
		},
		mounted() {
			this.setList()
		},
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			}
		},
		methods: {
			setList() {
				this.lists = this.options
				uni.createSelectorQuery()
					.in(this)
					.select('#list')
					.boundingClientRect()
					.exec(ret => {
						this.winHeight = ret[0].height
						this.itemHeight = this.winHeight / this.lists.length
					})
			},
			touchStart(e) {
				this.setList()
				this.touchmove = true
				let pageY = e.touches[0].pageY
				let index = Math.floor(pageY / this.itemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'indexed-list-' + index
					this.touchmoveIndex = index
				}
			},
			touchMove(e) {
				this.touchmove = true
				let pageY = e.touches[0].pageY
				let index = Math.floor(pageY / this.itemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'indexed-list-' + index
					this.touchmoveIndex = index
				}
			},
			touchEnd(e) {
				this.touchmove = false
				this.touchmoveIndex = -1
			},
			listClick(option) {
				this.$emit('list-click',option)
			}
		}
	}
</script>

<style>
	.indexed-list {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
	}
	/* 所有数据 */
	.indexed-list__scroll {
		flex: 1;
	}
	.indexed-list__scroll-title {
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		padding: 0 17.5px;
		box-sizing: border-box;
		background-color: rgb(247,247,247);
	}
	.indexed-list__scroll-content {
		width: calc(100% - 17.5px);
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		margin-left: 17.5px;
		box-sizing: border-box;
		border-bottom: 1px solid rgba(238,238,238,1);
	}
	.indexed-list__scroll-item .indexed-list__scroll-content:nth-last-of-type(1) {
		border: none;
	}
	/* 字母索引 */
	.indexed-list__menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 9999999;
		margin: auto 0;
		display: flex;
		flex-direction: column;
		width: 20px;
		background-color: #FFF;
	}
	.indexed-list__menu-item {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
	}
	.indexed-list__menu--active {
		background-color: #FFF;
	}
	.indexed-list__menu-text {
		line-height: 20px;
		font-size: 12px;
		text-align: center;
		color: #666666;
	}
	.indexed-list__menu-text--active {
		color: #1889F5;
	}
	/* 索引触发效果 */
	.indexed-list__alert-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.indexed-list__alert {
		width: 80px;
		height: 80px;
		border-radius: 80px;
		text-align: center;
		line-height: 80px;
		font-size: 35px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
