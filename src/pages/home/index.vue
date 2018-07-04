<template>
	<div class="page">
		<div class="home-swiper">
			<swiper :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="1000">
				<block v-for="(item,index) in swiper" :key="index">
					<swiper-item>
						<image :src="item.a_img" class="slide-image" />
					</swiper-item>
				</block>
			</swiper>
		</div>
		<div class="list-box">
			<div class="list-box-title">笔记</div>
			<div class="list-box-content">
				<div class="list-item list-show" v-for="(item,index) in article" :key="index" v-if="index <= 8">
					<a :href="'/pages/article/main?id=' + item.art_id">
						<img class="loading-art-img" :src="item.imgUrl" alt="" />
						<div class="list-msg">
							<div class="list-name">{{item.art_title == null ? "" : item.art_title}}<span v-if="!item.art_title" class="loading-art-name"></span></div>
							<div class="list-sketch">
								{{item.art_sketch == null ? "" : item.art_sketch}}
								<span class="loading-art-sketch" v-if="!item.art_title"></span>
								<span class="loading-art-sketch-row" v-if="!item.art_title"></span>
							</div>
							<div class="list-look">浏览量:{{item.art_browsing == null ? "" : item.art_browsing}}<span v-if="!item.art_browsing" class="loading-art-look"></span>
								<span class="list-time">{{item.add_time == null ? "" : item.add_time}}<span v-if="!item.add_time" class="loading-art-look"></span></span>
							</div>
						</div>
					</a>
				</div>
				<div class="list-item list-show" v-for="(item,index) in article" :key="index" v-if="index > 8">
					<articleView :item="(item)"></articleView>
				</div>
			</div>
		</div>
		<button :style="{display: isLogin ? 'block' : 'none'}" class="login-btn" @getuserinfo="getuser" lang="zh_CN" open-type="getUserInfo"></button>
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
				type: "",
				noanymore: false,
				isLogin: true,
				loading: true
			}
		},
		onLoad() {
			this.init()
			this.getData()
			this.getSwiper()
		},
		config: {
			"enablePullDownRefresh": true,
		},
		created() {

		},
		methods: {
			init() {
//				wx.clearStorage()
				let that = this
				wx.getSetting({
					success: function(e) {
						that.isLogin = (e.authSetting['scope.userInfo']) ? false : true
						if(!e.authSetting['scope.userInfo']) {
							wx.hideTabBar({
								animation: false
							})
						} else {
							that.login()
						}
					}
				})
			},
			getData() {
				let that = this
				wx.showLoading({
					title: '加载中',
				})
				let value = wx.getStorageSync("web_article_list")
				if(value && value.length >= (this.page+1) * this.limit) {
					let art_arr = []
					wx.hideLoading()
					for(let i = this.page * this.limit, len = (this.page + 1) * this.limit; i < len; i++) {
						art_arr.push(value[i])
					}
					this.page++
						if(this.loading) {
							store.commit("clearArticle")
							this.loading = false
						}
					store.commit('putArticleForLoca', art_arr)
				} else {
					this.loadData()
				}
			},
			loadData() {
				this.$http.get(api.getArticle(this.page + 1, this.limit, this.type)).then((res) => {
					wx.hideLoading()
					this.page++
						if(this.loading) {
							store.commit("clearArticle")
							this.loading = false
						}
					store.commit('putArticle', res.result.data)
					if(res.result.data.length < this.limit) {
						this.noanymore = true
					}
				})
			},
			getuser(e) {
				if(e.target.errMsg == "getUserInfo:ok") {
					this.isLogin = false
					this.login()
				}
			},
			getSwiper() {
				let value = wx.getStorageSync("web_swiper_list")
				if(value) {
					store.commit("initSwiper", value)
				} else {
					this.$http.get(api.swiper()).then((res) => {
						store.commit("initSwiper", res.result.data)
					})
				}
			},
			login() {
				let that = this
				wx.getSetting({
					success: function(e) {
						if(e.authSetting['scope.userInfo']) {
							wx.getUserInfo({
								success: function(ress) {
									store.commit("updateUserInfo", {
										img: ress.userInfo.avatarUrl,
										nickname: ress.userInfo.nickName
									})
									wx.login({
										success: function(res) {
											that.$http.post(api.login(), {
												code: res.code,
												encryptedData: ress.encryptedData,
												key: ress.iv
											}).then((res) => {
												if(res.code === 200) {
													wx.showTabBar({
														animation: true
													})
													store.commit("updateId", res.result.data.openid)
													store.commit("updateUserCollection", res.result.data.collection)
													store.commit("changeTheme", res.result.data.theme)
													store.commit("initUserArt", res.result.data.art_collection)
												}
											}).catch((err) => {
												console.log("err", err)
												that.login()
											})
										}
									})
								}
							})
						}
					}
				})
			}
		},
		computed: {
			...mapGetters([
				'article',
				'userInfo',
				'swiper'
			])
		},
		onShow() {
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.userInfo.theme
			})
		},
		onReachBottom() {
			if(this.noanymore) {
				wx.showToast({
					title: '没有更多数据了',
					icon: 'none',
					duration: 800
				})
				return
			}
			wx.showLoading({
				title: '加载中',
			})
			this.getData();
		}
	}
</script>

<style>
	page {
		background: #EFEFF4;
	}
	
	.page {
		width: 100%;
		min-height: 100%;
	}
	
	._div,
	._a {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 12px;
	}
	
	.home-swiper {
		width: 100%;
		height: 314rpx;
	}
	
	.home-swiper ._swiper,
	.home-swiper image {
		width: 100%;
		height: 100%;
	}
	
	.list-box {
		width: 100%;
		overflow: hidden;
		background: #fff;
	}
	
	.list-box-title {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		padding: 0 20rpx;
		position: relative;
		background: #fdfdfd;
		border: 1px solid #f2f2f2;
	}
	
	.list-box-title::before {
		content: "";
		width: 40rpx;
		height: 40rpx;
		background: #039ee6;
		position: absolute;
		left: -20rpx;
		top: -20rpx;
		transform: rotateZ(-45deg);
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
	
	.login-btn {
		position: fixed;
		background: rgba(0, 0, 0, 0);
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
	}
	
	.loading-art-img {
		background: #EFEFF4;
	}
	
	.loading-art-name,
	.loading-art-sketch,
	.loading-art-sketch-row,
	.loading-art-look {
		width: 50%;
		height: 24rpx;
		display: inline-block;
		background: #EFEFF4;
	}
	
	.loading-art-sketch {
		width: 100%;
	}
	
	.loading-art-sketch-row {
		width: 40%;
	}
	
	.loading-art-look {
		width: 120rpx;
	}
</style>