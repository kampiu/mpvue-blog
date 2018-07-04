<template>
	<a :href="'/pages/article/main?id=' + item.art_id">
		<img :src="item.imgUrl" alt="" />
		<div class="list-msg">
			<div class="list-name">{{item.art_title}}</div>
			<div class="list-sketch">{{item.art_sketch}}</div>
			<div class="list-look">浏览量:{{item.art_browsing	}} <span class="list-time">{{item.add_time}}</span></div>
		</div>
	</a>
</template>

<script>
	export default {
		props: ['item']
	}
</script>

<style>
	.list-item a {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	
	.list-item img {
		width: 180rpx;
		height: 120rpx;
		flex: 0 0 auto;
	}
	
	.list-item .list-msg {
		flex: 1 1 auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		font-size: 22rpx;
		padding: 5rpx 0 5rpx 20rpx;
	}
	
	.list-name {
		font-size: 24rpx;
		font-weight: 500;
		color: #333;
	}
	
	.list-look {
		font-size: 22rpx;
		color: #E7E7EB;
	}
	
	.list-time {
		font-size: 22rpx;
		color: #E7E7EB;
		float: right;
	}
	
	.list-sketch {
		font-size: 20rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		color: #C2C2C2;
		line-height: 32rpx;
		min-height: 64rpx;
	}
	
	.list-show {
		opacity: 0;
		animation-fill-mode: forwards;
		animation-duration: 1s;
		animation-name: listshow;
	}
	
	@-webkit-keyframes listshow {
		from {
			opacity: 0;
			margin: 40px 0 0 0;
		}
		to {
			opacity: 1;
			margin: 0;
		}
	}
</style>