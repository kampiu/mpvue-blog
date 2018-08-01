<template>
	<div class="color-picker-view" :style="{display:show ? 'block' : 'none'}">
		<div class="color-picker-mask" @click="cancelpick"></div>
		<div class="color-picker-content">
			<div class="cpc-title">主题选择</div>
			<div class="cpc-item" v-for="(item,index) in color" :data-color="item" @click="changecolor" :key="item">{{index}}<span :style="{background:color[index]}"></span></div>
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
		props: ['show'],
		data() {
			return {
				color: {
					'天蓝色': '#5179F1',
					'红色': '#F53D65',
					'紫色': '#9303A7',
					'橙色': '#FF9A00',
					'浅蓝色': '#0A67A3',
					'浅绿色': '#00A383',
				}
			}
		},
		onLoad() {

		},
		created() {

		},
		computed: {
			...mapGetters([
				'userInfo',
				'openid'
			])
		},
		methods: {
			cancelpick() {
				this.$emit("cancelpick")
			},
			changecolor(e) {
				if(e.target.dataset.color !== this.userInfo.theme) {
					store.commit("changeTheme", e.target.dataset.color)
					this.updatetheme({
						openid: this.openid,
						theme: e.target.dataset.color
					})
					this.cancelpick()
				} else {
					wx.showToast({
						title: '已经是这个颜色了好吗!',
						icon: 'none',
						duration: 1000
					})
				}
			},
			updatetheme(data) {
				this.$http.post(api.changetheme(), data).then((res) => {
					if(res.code !== 200) {
						this.updatetheme()
					}
				}).catch((err) => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.color-picker-view,
	.color-picker-mask {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		color: #333;
	}
	
	.color-picker-mask {
		background: rgba(0, 0, 0, 0.7);
		animation: colormaskshow 0.5s ease 0s 1;
	}
	
	.color-picker-content {
		position: absolute;
		width: 200px;
		height: auto;
		overflow: hidden;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background: #FFF;
		border-radius: 12px;
		animation: colorshow 0.5s 0s ease 1;
	}
	
	@keyframes colorshow {
		0% {
			-webkit-transform: translate(-50%, -40%);
			opacity: 0;
		}
		100% {
			-webkit-transform: translate(-50%, -50%);
			opacity: 1;
		}
	}
	
	.cpc-title {
		width: 100%;
		height: 36px;
		line-height: 36px;
		text-align: center;
		font-size: 24rpx;
		border-bottom: 1px solid #DFDFE1;
	}
	
	.cpc-item {
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;
		height: 36px;
		line-height: 36px;
		font-size: 22rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #DFDFE1;
	}
	
	.cpc-item:nth-last-child(1) {
		border: none;
	}
	
	.cpc-item>span {
		float: right;
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 1px solid #ACACAC;
		background: red;
	}
	
	@keyframes colormaskshow {
		from {
			background: rgba(0, 0, 0, 0);
		}
		to {
			background: rgba(0, 0, 0, 0.7);
		}
	}
</style>