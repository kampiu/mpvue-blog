//const _baseUrl = "http://localhost:3002/api/webside/"
const _baseUrl = "https://api.billson.club/api/webside/"

export default {
	getArticle(page,limit,type) {		
		return _baseUrl + "article?page=" + page + "&limit=" + limit + "&type=" + type
	},
	swiper(){
		return _baseUrl + "advertisement"
	},
	getAtricleItem(id){
		return _baseUrl + 'article?id=' + id
	},
	getTab(){
		return _baseUrl + 'tags'
	},
	searchArt(){
		return _baseUrl + 'search'
	},
	login(){
		return _baseUrl + 'wxlogin'
	},
	changetheme(){
		return _baseUrl + 'theme'
	},
	toCollection(){
		return _baseUrl + 'collect'
	},
	getshare(){
		return _baseUrl + 'share'
	}
}
//ThinkPHP = {
//	文章[页数/条数/类型]
//	广告
//	文章详情
//	搜索分类
//	搜索(采用querystring)
//	登录微信
//	获取用户信息微信
//	收藏
//	获取分享
//}
//
//Node = {
//	文章[页数/条数/类型]
//	广告
//	文章详情
//	搜索分类
//	搜索(采用querystring)
//	获取分享
//	登录微信
//	获取用户信息微信
//	收藏
//}
