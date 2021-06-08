import {
	api,
	appId,
	key
} from '@/config/index.js'
const md5 = require('./md5')
export function httpRequest(options) {
	return new Promise((resolve, reject) => {
		let header = {}
		let data = options.data
		if (options && options.header) header = options.header //传入header即用所传header
		if (uni.getStorageSync('token')) header.token = uni.getStorageSync('token')

		// 签名生成
		const timestamp = new Date().getTime() + ""
		let sign = "appid="+appId+"&timestamp="+timestamp
		sign += key
		sign = md5.md5(sign).toUpperCase()

		header.sign = sign
		header.appid = appId
		header.timestamp = timestamp
		uni.request({
			url: api + options.url,
			method: options.method.toLocaleUpperCase(),
			data: data,
			header: header,
			success: (res) => {
				// 服务端错误
				if (res.statusCode !== 200) {
					let message = ''
					switch(res.statusCode) {
						case 400:
							message = '错误请求'
							break;
						case 401:
							message = '未授权'
							break;
						case 403:
							message = '拒绝访问'
							break;
						case 404:
							message = '请求错误，未找到该资源'
							break;
						case 405:
							message = '请求方法未允许'
							break;
						case 408:
							message = '请求超时'
							break;
						case 500:
							message = '服务器开小差啦'
							break;
						case 501:
							message = '网络未实现'
							break;
						case 502:
							message = '网络错误'
							break;
						case 503:
							message = '服务不可用'
							break;
						case 504:
							message = '网络超时'
							break;
						case 505:
							message = 'http版本不支持该请求'
							break;
						default:
							message = `连接错误${error.response.status}`
					}
					resolve({
						code: 500,
						msg: message
					})
				}
				
				if (res.statusCode === 200) {
					if(res.data.code == 401){
						uni.removeStorageSync("token")
						uni.showModal({
							content: "登录已失效，是否前往登录？",
							confirmColor: "#2AC5F1",
							success: res => {
								if(res.confirm){
									let routes = getCurrentPages()
									uni.navigateTo({
										url: `/pages/login/index?redirect=${routes[routes.length - 1].route}`
									})
								}
							}
						})
					}
					resolve(res.data)
				}
			},
			fail: (err) => {
				resolve({
					code: 500,
					msg: '手机网络不太顺畅,请检查网络状况'
				})
			}
		})
	})
}
