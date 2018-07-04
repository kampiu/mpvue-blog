import Fly from "flyio/dist/npm/wx"
import cryptojs from 'crypto-js'
import aes from 'aes'

const fly = new Fly

const rand = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const crypt = () => {
	let len = 16,
		str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		result = ""
	while(len--){
		result += str[rand(0,str.length - 1)]
	}
	return result
}


fly.config.timeout = 10000
fly.config.retry = 4
fly.config.withCredentials = true

fly.interceptors.request.use((config, promise) => {
	config.headers["Content-Type"] = "application/x-www-form-urlencoded"
	if(config.body && !config.__retryCount){		//判断是否第一次发起请求   与请求的数据是否存在
		let key = cryptojs.enc.Latin1.parse('5AA765D61D8327DE'),
			ivs = crypt(),
			iv = cryptojs.enc.Latin1.parse(ivs)
			for(let k in config.body){
				config.body[k] = cryptojs.AES.encrypt(config.body[k],key,{iv:iv,mode:cryptojs.mode.CBC,padding:cryptojs.pad.ZeroPadding}).toString()
			}
		config.body.iv = ivs
	}
	return config
})

fly.interceptors.response.use((config, promise) => {
	if(config.status === 0 || config.status === 1) {
		console.log('请求超时!')
	}
	if(config.data.code < 200 && config.data.code >= 300) {
		console.error('数据返回有误')
		return Promise.reject(config)
	}
	if(config.data.result.iv){
		let key = cryptojs.enc.Latin1.parse('5AA765D61D8327DE'),
			iv = cryptojs.enc.Latin1.parse(config.data.result.iv)
		let decrypted = cryptojs.AES.decrypt(config.data.result.data, key, {
			iv: iv,
			padding: cryptojs.pad.ZeroPadding
		})
		let data = config.data
		data.result.data = JSON.parse(decrypted.toString(cryptojs.enc.Utf8))
		return data
	}
	return config.data
}, (error) => {
	let config = error.request
	if(!config || !config.retry) return Promise.reject(error)
	config.__retryCount = config.__retryCount || 0

	if(config.__retryCount >= config.retry) {
		console.log('promise error:' + error)
		return Promise.reject(error)
	}
	config.__retryCount += 1

	let backoff = new Promise(function(resolve) {
		setTimeout(function() {
			resolve()
		}, config.retryDelay || 1)
	})

	return backoff.then(function() {
		return(fly.config.method.toUpperCase() === "GET" ? fly.get(config) : fly.post(config))
	})
})





export default fly