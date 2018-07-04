<template>
	<div class="article--search-list">
		<div class="article-search-title" v-if="isType == 'true'">搜索的关键词：{{word}}<span>搜索</span></div>
		<div class="article-search-title" v-if="isType == 'false'">搜索的标签：{{word}}<span>搜索</span></div>
		<div class="list-box-content">
			<div v-if="collection && userInfo.collection == 0" class="nothin-data"></div>
			<div class="list-item list-show" v-for="(item,index) in list" :key="index">
				<articleView :item="(item)"></articleView>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/common/api'
	import store from '@/common/store'
	import articleView from '@/components/articleItem'
	import {
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		components: {
			articleView
		},
		data() {
			return {
				page: 0,
				limit: 10,
				loading: false,
				list: [],
				isType: null,
				word: "",
				collection: null
			}
		},
		computed: {
			...mapGetters([
				'searchList',
				'userInfo',
				'openid',
				'usercollection'
			])
		},
		config: {
			"enablePullDownRefresh": true,
		},
		onLoad(options) {
			if(options && options.type) {
				this.isType = options.type
			}
			if(options && options.word) {
				this.word = options.word
				this.getData()
			}
			wx.setNavigationBarTitle({
				title: '搜索结果'
			})
			if(options.collection) {
				this.collection = true
				this.getCollection()
				wx.setNavigationBarTitle({
					title: '收藏的笔记'
				})
			}
		},
		created() {

		},
		methods: {
			getData() {
				this.page++
					if(this.loading) {
						wx.hideLoading()
						this.loading = false
					}
				for(let i = 0, len = store.getters.searchList.length; i < len; i++) {
					if(this.loading) {
						wx.hideLoading()
						this.loading = false
					}
					if(i === this.page * this.limit - 1) {
						return
					}
					this.list.push(store.getters.searchList[i])
				}
			},
			getCollection() {
				if(this.userInfo.collection == 0) {
					return(
						wx.showToast({
							title: '没有更多数据了',
							icon: 'none',
							duration: 2000
						})
					)
				}
				let value = wx.getStorageSync("web_collection_list")
				if(value){
					store.commit("initUserCollection", value)
					this.list = this.usercollection
				}else{
					this.$http.post(api.getCollection(), {
						openid: this.openid
					}).then((res) => {
						if(res.code === 200) {
							store.commit("initUserCollection", res.result.data)
							this.list = this.usercollection
						} else {
							wx.showToast({
								title: '加载失败',
								icon: 'none',
								duration: 1000
							})
						}
					}).catch((err) => {
						console.log(err)
					})
				}
			}
		},
		onReachBottom() {
			if(store.getters.searchList.length <= this.page * this.limit) {
				wx.showToast({
					title: '没有更多数据了',
					icon: 'none',
					duration: 800
				})
				return
			}
			this.loading = true
			wx.showLoading({
				title: '加载中',
			})
			this.getData();
		},
		onShow() {
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.userInfo.theme
			})
		},
		onUnload() {
			this.page = 0
			this.limit = 10
			this.loading = false
			this.list = []
			this.isType = null
			this.word = ""
			this.collection = null
		}
	}
</script>

<style>
	page,
	.article--search-list {
		width: 100%;
		height: 100px;
		font-size: 24rpx;
	}
	
	._div,
	._a {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 12px;
	}
	
	.article-search-title {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		background: #EDEDED;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.article-search-title span {
		width: 130rpx;
		height: 56rpx;
		line-height: 54rpx;
		text-align: center;
		font-size: 20rpx;
		color: #FFF;
		border-radius: 12rpx;
		background: #039ee6;
	}
	
	.list-box-content {
		width: 100%;
		overflow: hidden;
		padding: 0 12rpx;
	}
	
	.list-item {
		width: 100%;
		height: 151rpx;
		border-bottom: 1rpx dotted #f2f2f2;
		padding: 10rpx;
		background: #fff;
	}
	.nothin-data{
		width:100%;
		height:100%;
		display:flex;
		justify-content: center;
		align-items: center;
		position:absolute;
		left:0;
		top:0;
		background-position: center center;
		background-size: 20% auto;
		background-repeat: no-repeat;
		background-image:url("data:image/png;base64,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") ;
	}
</style>