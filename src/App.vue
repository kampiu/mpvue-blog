<script>
	import cryptojs from 'crypto-js'
	import aes from 'aes'
	import api from './common/api'
	import store from './common/store'

	export default {
		created() {
			// 调用API从本地缓存中获取数据
//			const logs = wx.getStorageSync('logs') || []
//			logs.unshift(Date.now())
//			wx.setStorageSync('logs', logs)
		},
		methods: {
			
		}
	}
</script>

<style>
	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 200rpx 0;
		box-sizing: border-box;
	}
</style>