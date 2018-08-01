<template>
	<div class="search-view">
		<div class="seacrh-main">
			<input type="text" @input="write" maxlength="20" class="search-input" />
			<div id="search" @click="searchWord">Search</div>
		</div>
		<div class="search-tab">
			<div class="search-tab-title">标签分类</div>
			<div :class="item.tab_name === type ? 'tab' : 'tab tab-show'" @click="settype" v-for="(item,index) in tab" :data-name="item.tab_name" :style="{background:color[index]}" :key="item.id">{{item.tab_name}}<span :data-name="item.tab_name" :style="{color:color[index]}">{{item.tab_len}}</span></div>
		</div>
	</div>
</template>

<script>
	import api from '@/common/api'
	import store from '@/common/store'
	import {
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {
				color: ['#0DAAAA', 'orange', 'pink', 'skyblue', '#DA70D6', '#A020F0'],
				words: '',
				type: null,
			}
		},
		onLoad() {
			this.init()
		},
		created() {

		},
		methods: {
			init() {
				let value = wx.getStorageSync("web_tab_list")
				if(value){
					store.commit("putTab", value)
				}else{
					this.$http.get(api.getTab()).then((res) => {
						store.commit("putTab", res.result.data)
					}).catch((err) => {
						console.log(err)
					})
				}
			},
			rand(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min
			},
			settype(e) {
				wx.showLoading({
					title: '加载中',
				})
				this.type = e.target.dataset.name
				this.$http.get(api.getArticle(1, 10, e.target.dataset.name)).then((res) => {
				    console.log(res,"SEARCH")
					this.toBeGo(res, false, this.type)
				}).catch((err) => {
					console.log(err)
				})
			},
			searchWord() {
				if(this.words === "") {
					return (
						wx.showToast({
						title: '请输入正确的搜索内容',
						icon: 'none',
						duration: 2000
					}))
				}
				wx.showLoading({
					title: '加载中',
				})
				this.$http.post(api.searchArt(), {
					word: this.words
				}).then(res => {
				    console.log(res)
					this.toBeGo(res, true, this.words)
				}).catch(err => {
					console.log(err)
				})
			},
			write(e) {
				this.words = e.target.value
			},
			toBeGo(res, bool, data) {
				if(res.code === 200 && res.result.data.data.length > 0) {
					store.commit("updateSearch", res.result.data.data)
					wx.hideLoading()
					wx.navigateTo({
						url: './../articleList/main?type=' + bool + '&word=' + data
					})
				} else {
					wx.showToast({
						title: '没有更多数据了',
						icon: 'none',
						duration: 2000
					})
				}
			}
		},
		computed: {
			...mapGetters([
				'tab',
				'searchList',
				'userInfo'
			])
		},
		onShow() {
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.userInfo.theme
			})
		},
		onHide() {

		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.search-view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.seacrh-main {
		width: 100%;
		height: 480rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-direction: column;
		flex: 0 0 auto;
	}
	
	.search-input {
		width: 580rpx;
		height: 68rpx;
		-webkit-appearance: none;
		border: 1px solid #CCCCCC;
		line-height: 64rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		font-size: 24rpx;
		border-radius: 34rpx;
	}
	
	#search {
		width: 280rpx;
		height: 68rpx;
		line-height: 68rpx;
		text-align: center;
		color: #FFF;
		background: #5179F1;
		border-radius: 28rpx;
		font-size: 26rpx;
		margin: 46rpx auto;
	}
	
	.search-tab {
		width: 100%;
		height: 100%;
		flex: 1 1 auto;
		text-align: center;
		padding: 30px 10px 0 10px;
		position: relative;
	}
	
	.search-tab-title {
		width: 100%;
		height: 30px;
		line-height: 30px;
		padding: 0 12px;
		position: absolute;
		left: 0;
		top: 0;
		font-size: 14px;
		color: #ACACAC;
		text-align: left;
	}
	
	.tab,
	#tab-hidden {
		width: 96px;
		height: 26px;
		line-height: 26px;
		text-align: left;
		font-size: 12px;
		color: #FFF;
		margin: 10px;
		border-radius: 13px;
		background: orange;
		float: left;
		padding: 0 6px 0 8px;
		box-sizing: border-box;
		transform: all linear .6s;
	}
	
	.tab>span {
		float: right;
		border-radius: 8px;
		padding: 0px;
		display: inline-block;
		width: 16px;
		height: 16px;
		text-align: center;
		margin-top: 5px;
		line-height: 16px;
		background: #FFF;
		font-size: 20rpx;
	}
	
	.tab-show {
		animation-duration: 0.8s;
		animation-name: tabshow;
	}
	
	@-webkit-keyframes tabshow {
		from {
			opacity: 0;
			margin: 30px 10px 10px 10px;
		}
		to {
			opacity: 1;
			margin: 10px;
		}
	}
</style>