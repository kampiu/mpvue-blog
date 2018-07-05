import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		article: [{
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}, {
			art_id: 0,
			art_title: null,
			add_time: null,
			art_sketch: null,
			art_browsing: null,
			imgUrl: null
		}], //首页加载笔记
		tab: [], //search的标签
		articleItem: "", //笔记详细数据
		searchList: [], //搜索的详细数据
		openid: null, //用户openid
		userInfo: {
			img: '',
			nickname: '',
			collection: 0,
			theme: '#5179F1',
			art: []
		},
		usercollection: [],
		sharelist: [],
		swiper: [],
		isLogin: true
	},
	getters: {
		article: state => state.article,
		tab: state => state.tab,
		articleItem: state => state.articleItem,
		searchList: state => state.searchList,
		openid: state => state.openid,
		userInfo: state => state.userInfo,
		sharelist: state => state.sharelist,
		usercollection: state => state.usercollection,
		swiper: state => state.swiper,
		isLogin: state => state.isLogin
	},
	mutations: {
		putArticle(state, list) {
			let art_list = []
			for(let i = 0, len = list.length; i < len; i++) {
				state.article.push(list[i])
			}
		},
		clearArticle(state) {
			state.article = []
		},
		upLoginState(state, bool) {
			state.isLogin = bool
		},
		initSwiper(state, list) {
			state.swiper = list
			wx.setStorage({
				key: "web_swiper_list",
				data: list
			})
		},
		putTab(state, list) {
			state.tab = list
			wx.setStorage({
				key: "web_tab_list",
				data: list
			})
		},
		upArt(state, article) {
			state.articleItem = article
		},
		clearArt(state) {
			state.articleItem = ""
		},
		updateSearch(state, list) {
			state.searchList = list
		},
		updateId(state, openid) {
			state.openid = openid
		},
		updateUserInfo(state, obj) {
			state.userInfo.img = obj.img
			state.userInfo.nickname = obj.nickname
		},
		initUserCollection(state, list) {
			state.usercollection = list
			if(!wx.getStorageSync("web_collection_list")) {
				wx.setStorage({
					key: "web_collection_list",
					data: list
				})
			}
		},
		updateUserCollection(state, count) {
			state.userInfo.collection = count
		},
		removeColl(state, data) {
			state.userInfo.collection -= 1
			for(let i = 0, len = state.userInfo.art.length; i < len; i++) {
				if(parseInt(state.userInfo.art[i]) === parseInt(data.art_id)) {
					state.userInfo.art.splice(i, 1)
					break
				}
			}
			for(let i = 0, len = state.usercollection.length; i < len; i++) {
				if(parseInt(state.usercollection[i].art_id) === parseInt(data.art_id)) {
					state.usercollection.splice(i, 1)
					break
				}
			}
			let art_list = []
			wx.getStorage({
				key: 'web_collection_list',
				complete: function(res) {
					if(res.errMsg == "getStorage:ok") {
						art_list = res.data
					}
					for(let i = 0, len = art_list.length; i < len; i++) {
						if(art_list[i].art_id == data.art_id) {
							art_list.splice(i, 1)
							wx.setStorage({
								key: "web_collection_list",
								data: art_list
							})
							return
						}
					}
				}
			})
		},
		addColl(state, data) {
			state.userInfo.collection += 1
			state.userInfo.art.push(data.art_id)
			state.usercollection.push(data)
			let art_list = []
			wx.getStorage({
				key: 'web_collection_list',
				complete: function(res) {
					if(res.errMsg == "getStorage:ok") {
						art_list = res.data
					}
					if(art_list.length > 0){
						for(let i = 0,len = art_list.length;i < len;i++){
							if(art_list[i].art_id == data.art_id){
								return
							}
						}
					}
					art_list.push(data)
					wx.setStorage({
						key: "web_collection_list",
						data: art_list
					})
				}
			})
		},
		initUserArt(state, str) {
			if(!str || str == "") {
				return
			}
			state.userInfo.art = str.split(",")
		},
		changeTheme(state, theme) {
			state.userInfo.theme = theme 
			//			wx.setTabBarStyle({
			//				selectedColor: theme
			//			})
			//			let strs = theme.replace("#", "")
			//			for(let i = 0; i < 3; i++) {
			//				let str = "",title = "",iconPath = ""
			//				switch(i) {
			//					case 0:
			//						str = "./image/" + strs + "/home-select.png"
			//						title = "首页"
			//						iconPath = "./image/home.png"
			//						console.log("进入第一次")
			//						break
			//					case 1:
			//						str = "./image/" + strs + "/search-select.png"
			//						title = "搜索"
			//						iconPath = "./image/search.png"
			//						console.log("进入第2次")
			//						break
			//					case 2:
			//						str = "./image/" + strs + "/personal-select.png"
			//						title = "个人"
			//						iconPath = "./image/personal.png"
			//						console.log("进入第3次")
			//						break
			//					default:
			//						str = "./image/5179F1/home-select.png"
			//						title = "首页"
			//						iconPath = "./image/home.png"
			//						console.log("进入默认")
			//						break
			//				}
			//				wx.setTabBarItem({
			//					index: i,
			//					text:title,
			//					iconPath:iconPath,
			//					selectedIconPath: str,
			//					success:function(res){
			//						console.log("图片问题：",res)
			//					}
			//				})
			//			}
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: theme,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		initShare(state, list) {
			list.forEach((item, index) => {
				item.toggle = false
				state.sharelist.push(item)
			})
		}
	}
})


export default store