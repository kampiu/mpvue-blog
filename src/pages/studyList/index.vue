<template>
	<div>
		<div class="tip">点击链接复制 <span>灰色框为密码</span></div>
		<div class="share-box">
			<div class="share-item" v-for="(item,index) in sharelist" :key="item.share_password + item.share_id">
				<div :class="item.toggle ? 'share-title share-title-active' : 'share-title'" :data-index="index" @click="toggleList">{{item.share_name}}<span :class="item.toggle ? 'active' : ''" :data-index="index" @click.stop="toggleList"></span></div>
				<div class="share-link" v-if="item.toggle">
					<div class="share-son-item" @click="copylink" :data-link="item.share_link">
						{{item.share_link}}
						<span>{{item.share_password}}</span>
					</div>
				</div>
			</div>
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
				old: 0
			}
		},
		onLoad() {
			this.initData()
		},
		created() {

		},
		methods: {
			initData(e) {
				if(this.sharelist.length > 0){
					return
				}
				wx.showLoading({
					title: '加载中...',
				})
				this.$http.get(api.getshare()).then((res) => {
				    console.log(res)
					if(res.code === 200) {
						store.commit("initShare",res.result.data.data)
						wx.hideLoading()
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			toggleList(e) {
				if(this.old == e.target.dataset.index) {
					this.sharelist[e.target.dataset.index].toggle = !this.sharelist[e.target.dataset.index].toggle
				} else {
					this.sharelist[this.old].toggle = false
					this.sharelist[e.target.dataset.index].toggle = true
					this.old = e.target.dataset.index
				}
			},
			copylink(e) {
				wx.setClipboardData({
					data: e.target.dataset.link,
					success: function(res) {

					}
				})
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
				'sharelist',
				'userInfo'
			])
		}
	}
</script>

<style>
	page {
		font-size: 22rpx;
		width: 100%;
		height: 100%;
		background: #EFEFF4;
		position: relative;
	}
	
	.tip {
		width: 100%;
		height: 20px;
		line-height: 20px;
		box-sizing: border-box;
		padding: 0 20px;
		font-size: 20rpx;
		margin-top: 20rpx;
		color: #666;
		display:flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.share-item {
		width: 100%;
		min-height: 40px;
		overflow: hidden;
		padding: 0 12px;
		box-sizing: border-box;
		margin-top: 20rpx;
	}
	
	.share-title {
		width: 100%;
		height: 40px;
		line-height: 40;
		display: flex;
		align-items: center;
		background: #FFF;
		box-sizing: border-box;
		padding: 0 20rpx;
		overflow: hidden;
		justify-content: space-between;
		transition: all linear .2s;
		border-bottom: 1rpx solid #DFDFE1;
	}
	
	.share-title-active {
		color: #AAAAAA;
	}
	
	.share-title span {
		width: 20px;
		height: 20px;
		display: inline-block;
		transform: rotateZ(0deg);
		transition: all linear .2s;
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-position: center center;
		background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAEf0lEQVR4Xu2cPWhTURzF7z+tBS24OfgxibgIihDUF2w+QJzcXBxKNwcRobPgInZ2KU4uHTq5CQ7FoXkhvKYOXUq2Tl0sFgo6aUnflVfaUjRpXr5u3v2f0zUvyf2d8+OElCRi+AedgEDTE95QAHAJKAAFAE8AHJ8LQAHAEwDH5wJQAPAEwPG5ABQAPAFwfC4ABQBPAByfC0ABwBMAx+cCUADwBMDxuQAUADwBcHwuAAUATwAcnwtAAcATAMfnAlAA8ATA8bkAFAA8AXB8LgAFAE8AHJ8LQAHAEwDH5wJQAPAEwPG5ABQAPAFwfC4ABQBPAByfC0ABwBMAx+cCUADwBMDxuQAUwH0CtdrGJZE/13O5eKdQKGyLiHV/imw8YxRFVw8O5Jq157aLxfx316dyugD1ev1KqzWxJGIeHYNaa7YmJszszEyw7hp+nM9Xr3+71WodLIuYO6fOsR7HdrZSKWy5OpszAZrN5tTu7q+miLnxL5y1tiUiT0ul4LMr8HE+z+pq42EuZ1eMMRf+P4f9MT09dTOfz/90cUZnAlSra69FzEInKBQJzi7/JJ3FUil4pUqAMIxWjJHHZ0FplyBl+UlEm6VScFubABvGyN1uUFol6KF8Y63ZKZeDy92yGsbtzl4CwjBaMkbm0hxamwS9lJ/kY635Wi4HZ65lmhzTXONMgFotumetNIxJ9xP1WiTotfykNJHck2Lx/pc0BQ56jTMBkoNWq9FbEXmT9tC+S9BP+daaj+Vy8DxtRoNe51SA5LBhGL03RubTHtxXCfop3xizXCw+mBOROG0+g17nXAAECXwp//DlZlCD+r2/1iXwqfyxCqBxCXwrf+wCaJLAx/IzIYAGCXwtPzMC+CyBz+VnSgAfJfC9/MwJ4JMEGsrPpAA+SKCl/MwKkGUJNJWfaQGyKIG28jMvQJYk0Fi+FwJkQQKt5XsjwDgl0Fy+VwKMQwLt5XsngEsJEMr3UgAXEqCU760Ao5QAqXyvBRiFBGjley/AMCVALF+FAMOQALV8NQIMIkEcy17nL2omj9z2z/mndzueZMAbxvah0AHP3fbufX7QdL/9t3T1l69qAY7rqlbXPoiYF6MQbByf2x8Rx8nDqlqAEUugZvZPS6VSgARwyEugsnyVLwGn7R6SBGrLVy/AEJZAdfkQAgwggfryYQToQwKI8qEE6EECmPLhBDj6j+GiMfKy3ftra+2nUil45vL7+aN+n9/t8dW+DewEbq2VMGzMH/1k3fnkuqMfoViI49/vKpVKq1tomm6HE+C4vEajcXF/Pz781bLJSbNZKBT2NBWblgVWgLQBab+OAmhvuAsfBaAA4AmA43MBKAB4AuD4XAAKAJ4AOD4XgAKAJwCOzwWgAOAJgONzASgAeALg+FwACgCeADg+F4ACgCcAjs8FoADgCYDjcwEoAHgC4PhcAAoAngA4PheAAoAnAI7PBaAA4AmA43MBKAB4AuD4XAAKAJ4AOD4XgAKAJwCOzwWgAOAJgONzASgAeALg+FwACgCeADg+F4ACgCcAjv8XuA1on3gfu2YAAAAASUVORK5CYII=");
	}
	
	.share-title .active {
		transform: rotateZ(180deg);
	}
	
	.share-link {
		width: 100%;
		min-height: 40px;
		background: #FFF;
		line-height: 40px;
		box-sizing: border-box;
		padding: 0 0 0 30rpx;
		transition: all linear .4s;
	}
	
	.share-son-item {
		width: 100%;
		height: 38px;
		display: flex;
		border-bottom: 1rpx solid #DFDFE1;
		align-items: center;
		justify-content: space-between;
		font-size: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
	}
	
	.share-son-item:nth-last-child(1) {
		border-bottom: none;
	}
	
	.share-son-item span {
		display: inline-block;
		width: 60px;
		height: 26px;
		text-align: center;
		line-height: 26px;
		font-size: 22rpx;
		background:#F2F2F2;
		border-radius: 4px;
	}
</style>