<template>
	<div class="article-view">
		<div class="acricle-content">
			<wxParse :content="articleItem" @preview="preview" />
			<div class="collection-mark" @click="postCollection"><span :class="colle ? 'collection-active' : ''"></span></div>
			<div class="home-mark" @click="toHome"><span class="tohome"></span></div>
		</div>
		<div class="article-share-list">
			<div class="share-item">

			</div>
		</div>
		<button :style="{display: isLogin ? 'block' : 'none'}" class="login-btn" @getuserinfo="getuser" lang="zh_CN" open-type="getUserInfo"></button>
	</div>
</template>

<script>
	import api from '@/common/api'
	import store from '@/common/store'
	import wxParse from 'mpvue-wxparse'
	import {
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {
				article: {},
				colle: false,
				id: null,
				isLogin:true
			}
		},
		onLoad(options) {
			this.id = options.id
			this.init(options.id)
			this.checkTheColl(options.id)
		},
		created() {

		},
		components: {
			wxParse
		},
		methods: {
			init(id) {
				this.$http.get(api.getAtricleItem(id)).then((res) => {
					if(res.code === 200) {
						this.article = res.result
					}
					res.code === 200 && store.commit("upArt", res.result.data ? res.result.data.art_content : res.result.art_content)
					wx.setNavigationBarTitle({
						title: res.result.art_title
					})
				})
				let that = this
				wx.getSetting({
					success: function(e) {
						that.isLogin = (e.authSetting['scope.userInfo']) ? false : true
						if(!e.authSetting['scope.userInfo']){
							wx.hideTabBar({
								animation:false
							})
						}else{
							that.login()
						}
					}
				})
			},
			getuser(e){
				if(e.target.errMsg == "getUserInfo:ok") {
					this.isLogin = false
					this.login()
				}
			},
			login(){
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
														animation:true
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
			},
			checkTheColl(id) {
				if(this.usercollection.length === 0){
					return
				}
				this.usercollection.forEach((item, index) => {
					if(item.art_id == id) {
						this.colle = true
						return
					}
				})
			},
			preview(src, e) {

			},
			toHome(){
				wx.switchTab({
					url: './../home/main'
				})
			},
			postCollection(){
				let data = {
					add_time: this.article.add_time,
					art_browsing: this.article.art_browsing,
					art_id: this.article.art_id,
					art_sketch: this.article.art_sketch,
					art_tags: this.article.art_tags,
					art_title: this.article.art_title,
					imgUrl: this.article.imgUrl,
					tab_name: this.article.tab_name
				}
				this.tocell()
				store.commit( this.colle ? "removeColl" : "addColl" , data)
				this.colle = !this.colle
				wx.showToast({
					title: this.colle ? '收藏成功' : '取消收藏成功',
					icon: 'none',
					duration: 800
				})
			},
			tocell() {
				this.$http.post(api.toCollection(), {
					art_id: this.id,
					openid: this.openid
				}).then((res) => {
					if(res.code !== 200){
						this.tocell()
					}
				}).catch((err) => {
					console.log("err", err)
				})
			}
		},
		onShareAppMessage() {
			return {
				title: this.article.art_title,
				path: '/pages/article/main?id=' + this.article.art_id,
				imageUrl: this.article.imgUrl,
				success: function(res) {
					console.log(res)
				},
				fail: function(res) {
					
				}
			}
		},
		onShow() {
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.userInfo.theme
			})
		},
		computed: {
			...mapGetters([
				'articleItem',
				'userInfo',
				'openid',
				'usercollection'
			])
		},
		onUnload() {
			store.commit("clearArt")
			this.article = {}
			this.colle = false
			this.id = null
		}
	}
</script>

<style>
	.login-btn{
		position:fixed;
		background:rgba(0,0,0,0);
		left:0;
		top:0;
		width:100%;
		height:100%;
		z-index: 100;
	}
	.article-view {
		width: 100%;
		overflow: hidden;
	}
	
	.acricle-content {
		width: 100%;
		overflow: hidden;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		position: relative;
	}
	
	.article-view-bg {
		width: 100%;
		height: 320rpx;
		background: #666;
		position: relative;
		overflow: hidden;
	}
	
	::-webkit-scrollbar {
		height: 0;
		width: 0;
	}
	
	.spinner {
		width: 30px;
		height: 30px;
		position: relative;
	}
	
	.container1>.div,
	.container2>.div,
	.container3>.div {
		width: 8px;
		height: 8px;
		background-color: #039EE6;
		border-radius: 100%;
		position: absolute;
		-webkit-animation: bouncedelay 1.2s infinite ease-in-out;
		animation: bouncedelay 1.2s infinite ease-in-out;
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}
	
	.spinner .spinner-container {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	
	.container2 {
		-webkit-transform: rotateZ(45deg);
		transform: rotateZ(45deg);
	}
	
	.container3 {
		-webkit-transform: rotateZ(90deg);
		transform: rotateZ(90deg);
	}
	
	.circle1 {
		top: 0;
		left: 0;
	}
	
	.circle2 {
		top: 0;
		right: 0;
	}
	
	.circle3 {
		right: 0;
		bottom: 0;
	}
	
	.circle4 {
		left: 0;
		bottom: 0;
	}
	
	.container2 .circle1 {
		-webkit-animation-delay: -1.1s;
		animation-delay: -1.1s;
	}
	
	.container3 .circle1 {
		-webkit-animation-delay: -1.0s;
		animation-delay: -1.0s;
	}
	
	.container1 .circle2 {
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
	}
	
	.container2 .circle2 {
		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
	}
	
	.container3 .circle2 {
		-webkit-animation-delay: -0.7s;
		animation-delay: -0.7s;
	}
	
	.container1 .circle3 {
		-webkit-animation-delay: -0.6s;
		animation-delay: -0.6s;
	}
	
	.container2 .circle3 {
		-webkit-animation-delay: -0.5s;
		animation-delay: -0.5s;
	}
	
	.container3 .circle3 {
		-webkit-animation-delay: -0.4s;
		animation-delay: -0.4s;
	}
	
	.container1 .circle4 {
		-webkit-animation-delay: -0.3s;
		animation-delay: -0.3s;
	}
	
	.container2 .circle4 {
		-webkit-animation-delay: -0.2s;
		animation-delay: -0.2s;
	}
	
	.container3 .circle4 {
		-webkit-animation-delay: -0.1s;
		animation-delay: -0.1s;
	}
	
	@-webkit-keyframes bouncedelay {
		0%,
		80%,
		100% {
			-webkit-transform: scale(0.0)
		}
		40% {
			-webkit-transform: scale(1.0)
		}
	}
	
	@keyframes bouncedelay {
		0%,
		80%,
		100% {
			transform: scale(0.0);
			-webkit-transform: scale(0.0);
		}
		40% {
			transform: scale(1.0);
			-webkit-transform: scale(1.0);
		}
	}
	
	.loading-view {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.collection-mark ,.home-mark{
		width: 36px;
		height: 36px;
		position: fixed;
		right: 6px;
		bottom: 40px;
		border-radius: 50%;
		background: rgba(0, 0, 255, 0.6);
		border: 6px solid rgba(128, 177, 225, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.home-mark{
		bottom:100px;
	}
	
	.collection-mark span ,.home-mark span{
		display: inline-block;
		transform: all linear .4s;
		width: 24px;
		height: 24px;
		background-size: 20px auto;
		background-position: center center;
		background-repeat: no-repeat;
		background-image: url("data:image/png;base64,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");
	}
	
	.collection-mark span.collection-active {
		background-image: url("data:image/png;base64,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");
	}
	.home-mark .tohome{
		background-image: url("data:image/png;base64,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");
	}
</style>
<style>
	.wxParse {
		width: 100%;
		min-height: 90vh;
		font-family: Helvetica, sans-serif;
		font-size: 12px;
		color: #666;
		line-height: 1.8;
	}
	
	.wxParse view {
		word-break: hyphenate;
	}
	
	.wxParse .inline {
		display: inline;
		margin: 0;
		padding: 0;
	}
	
	.wxParse .div {
		margin: 0;
		padding: 0;
	}
	
	.wxParse .h1 {
		font-size: 2em;
		margin: 0.67em 0;
	}
	
	.wxParse .h2 {
		font-size: 1.5em;
		margin: 0.83em 0;
		color: #333;
	}
	
	.wxParse .h3 {
		font-size: 1.17em;
		margin: 1em 0;
		color: #333;
	}
	
	.wxParse .h4 {
		margin: 1.33em 0;
		color: #333;
	}
	
	.wxParse .h5 {
		font-size: 0.83em;
		margin: 1.67em 0;
	}
	
	.wxParse .h6 {
		font-size: 0.67em;
		margin: 2.33em 0;
	}
	
	.wxParse .h1,
	.wxParse .h2,
	.wxParse .h3,
	.wxParse .h4,
	.wxParse .h5,
	.wxParse .h6,
	.wxParse .b,
	.wxParse .strong {
		font-weight: bolder;
	}
	
	.wxParse .p {
		margin: 1em 0;
	}
	
	.wxParse .i,
	.wxParse .cite,
	.wxParse .em,
	.wxParse .var,
	.wxParse .address {
		font-style: italic;
	}
	
	.wxParse .pre,
	.wxParse .tt,
	.wxParse .code,
	.wxParse .kbd,
	.wxParse .samp {
		font-family: monospace;
	}
	
	.wxParse .pre {
		overflow: auto;
		background: #333333;
		padding: 8px;
		white-space: pre;
		margin: 1em 0px;
	}
	
	.wxParse .code {
		display: inline;
		background: #333333;
		color: #FFFFFF;
		font-size: 22rpx;
	}
	
	.wxParse .code .hljs-comment {
		font-style: normal;
	}
	
	.wxParse .big {
		font-size: 1.17em;
	}
	
	.wxParse .small,
	.wxParse .sub,
	.wxParse .sup {
		font-size: 0.83em;
	}
	
	.wxParse .sub {
		vertical-align: sub;
	}
	
	.wxParse .sup {
		vertical-align: super;
	}
	
	.wxParse .s,
	.wxParse .strike,
	.wxParse .del {
		text-decoration: line-through;
	}
	
	.wxParse .strong,
	.wxParse .s {
		display: inline;
	}
	
	.wxParse .a {
		color: deepskyblue;
	}
	
	.wxParse .video {
		text-align: center;
		margin: 10px 0;
	}
	
	.wxParse .video-video {
		width: 100%;
	}
	
	.wxParse .img {
		display: inline-block;
		width: 0;
		height: 0;
		max-width: 100%;
		overflow: hidden;
		margin-left: 50%;
		transform: translateX(-50%);
	}
	
	.wxParse .blockquote {
		margin: 5px 0;
		padding: 10px 0 10px 10px;
		font-family: Courier, Calibri, "宋体";
		background: #f5f5f5;
		border-left: 3px solid #dbdbdb;
	}
	
	.wxParse .blockquote .p {
		margin: 0;
	}
	
	.wxParse .ul,
	.wxParse .ol {
		display: block;
		margin: 1em 0;
		padding-left: 16px;
	}
	
	.wxParse .ol {
		list-style-type: disc;
	}
	
	.wxParse .ol {
		list-style-type: decimal;
	}
	
	.wxParse .li {
		display: list-item;
		align-items: baseline;
		text-align: match-parent;
	}
	
	.wxParse .ul .ul,
	.wxParse .ol .ul {
		list-style-type: circle;
	}
	
	.wxParse .ol .ol .ul,
	.wxParse .ol .ul .ul,
	.wxParse .ul .ol .ul,
	.wxParse .ul .ul .ul {
		list-style-type: square;
	}
	
	.wxParse .u {
		text-decoration: underline;
	}
	
	.wxParse .hide {
		display: none;
	}
	
	.wxParse .del {
		display: inline;
	}
	
	.wxParse .figure {
		overflow: hidden;
	}
	
	.wxParse .table {
		width: 100%;
	}
	
	.wxParse .thead,
	.wxParse .tfoot,
	.wxParse .tr {
		display: flex;
		flex-direction: row;
	}
	
	.wxParse .tr {
		width: 100%;
		display: flex;
		border-right: 1px solid #e0e0e0;
		border-bottom: 1px solid #e0e0e0;
	}
	
	.wxParse .th,
	.wxParse .td {
		display: flex;
		width: 580px;
		overflow: auto;
		flex: 1;
		padding: 5px;
		text-align: center;
		border-left: 1px solid #e0e0e0;
	}
	
	.wxParse .td:last {
		border-top: 1px solid #e0e0e0;
	}
	
	.wxParse .th {
		background: #f0f0f0;
		border-top: 1px solid #e0e0e0;
	}
</style>
<style>
	/*

Monokai Sublime style. Derived from Monokai by noformnocontent http://nn.mit-license.org/

*/
	
	.hljs {
		display: block;
		overflow-x: auto;
		padding: 0.5em;
		background: #23241f;
	}
	
	.hljs,
	.hljs-tag,
	.hljs-subst {
		color: #f8f8f2;
	}
	
	.hljs-strong,
	.hljs-emphasis {
		color: #a8a8a2;
	}
	
	.hljs-bullet,
	.hljs-quote,
	.hljs-number,
	.hljs-regexp,
	.hljs-literal,
	.hljs-link {
		color: #ae81ff;
	}
	
	.hljs-code,
	.hljs-title,
	.hljs-section,
	.hljs-selector-class {
		color: #a6e22e;
	}
	
	.hljs-strong {
		font-weight: bold;
	}
	
	.hljs-emphasis {
		font-style: italic;
	}
	
	.hljs-keyword,
	.hljs-selector-tag,
	.hljs-name,
	.hljs-attr {
		color: #f92672;
	}
	
	.hljs-symbol,
	.hljs-attribute {
		color: #66d9ef;
	}
	
	.hljs-params,
	.hljs-class .hljs-title {
		color: #f8f8f2;
	}
	
	.hljs-string,
	.hljs-type,
	.hljs-built_in,
	.hljs-builtin-name,
	.hljs-selector-id,
	.hljs-selector-attr,
	.hljs-selector-pseudo,
	.hljs-addition,
	.hljs-variable,
	.hljs-template-variable {
		color: #e6db74;
	}
	
	.hljs-comment,
	.hljs-deletion,
	.hljs-meta {
		color: #75715e;
	}
</style>