import Vue from 'vue'
import App from './App'
import store from './common/store'
import fly from '@/common/http'



Vue.prototype.$http = fly
Vue.config.productionTip = true
App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()

export default {
	config: {
		pages: [
			'pages/article/main',
			'pages/search/main',
			'pages/webInfo/main',
			'pages/studyList/main',
			'pages/personal/main',
			'pages/articleList/main',
			'^pages/home/main'
		],
		window: {
			backgroundTextStyle: 'light',
			navigationBarBackgroundColor: '#5179F1',
			navigationBarTitleText: 'WeChat',
			navigationBarTextStyle: 'white'
		},
		tabBar: {
			"color": "#555555",
			"selectedColor": "#5179F1",
			"backgroundColor": "#FFF",
			"borderStyle": "#5179F1",
			"position": "bottom",
			"list": [{
					"pagePath": "pages/home/main",
					"text": "首页",
					"iconPath": "./image/home.png",
					"selectedIconPath": "./image/5179F1/home-select.png"
				},
				{
					"pagePath": "pages/search/main",
					"text": "搜索",
					"iconPath": "./image/search.png",
					"selectedIconPath": "./image/5179F1/search-select.png"
				},
				{
					"pagePath": "pages/personal/main",
					"text": "个人",
					"iconPath": "./image/personal.png",
					"selectedIconPath": "./image/5179F1/personal-select.png"
				}
			]
		}
	}
}