import Vue from 'vue'
import App from './index'
import store from './../../common/store'


const app = new Vue({
	...App,
	store
})
app.$mount()


