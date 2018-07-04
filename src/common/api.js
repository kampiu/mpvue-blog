const _baseUrl = 'https://node.billson.club/'
//const _baseUrl = 'http://localhost:8088/'


export default {
	getArticle(page,limit,type) {		
		return _baseUrl + "art?page=" + page + "&limit=" + limit + "&type=" + type
	},
	swiper(){
		return _baseUrl + "advertisement"
	},
	getAtricleItem(id){
		return _baseUrl + 'art?id=' + id
	},
	getTab(){
		return _baseUrl + 'gettab'
	},
	searchArt(){
		return _baseUrl + 'search'
	},
	login(){
		return _baseUrl + 'wxlogin'
	},
	changetheme(){
		return _baseUrl + 'updateuserinfo'
	},
	getCollection(){
		return _baseUrl + 'getcollection'
	},
	toCollection(){
		return _baseUrl + 'collection'
	},
	getshare(){
		return _baseUrl + 'share'
	}
}