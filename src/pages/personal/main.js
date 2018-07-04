import Vue from 'vue'
import App from './index'
import store from './../../common/store'
import fly from '@/common/http'

Vue.prototype.$http = fly
const app = new Vue({
	...App,
	store
})
app.$mount()


export default {
  config: {
    navigationBarTitleText: '个人'
  }
}