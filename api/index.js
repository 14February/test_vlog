import {
	httpRequest
} from '@/static/utils/request'

// 获取图片地址
export function getImgUrl() {
	return httpRequest({
		url: '/imge/getUrl',
		method: 'post',
	})
}

// 获取验证码
export function getMsg(data) {
	return httpRequest({
		url: '/wxuser/sendSms',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
    data
	})
}

// 手机号登录
export function loginByPhone(data) {
	return httpRequest({
		url: '/wxuser/loginByPhone',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 注册接口
export function register() {
	return httpRequest({
		url: '/vlog/register',
		method: 'post'
	})
}


// 微信获取openid
export function getOpenid(data) {
	return httpRequest({
		url: '/wxuser/login',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 获取手机号码
export function getPhoneNumber(data) {
	return httpRequest({
		url: '/wxuser/getWxUserPhone',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 微信一键登录
export function loginByWx(data) {
	return httpRequest({
		url: '/wxuser/oneClickLogin',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 获取Vlog景区列表
export function queryScenicList(data) {
	return httpRequest({
		url: '/vlog/queryScenicList',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 创建Vlog视频
export function createVlog(caseId,data) {
	return httpRequest({
		url: `/vlog/createVlog?caseId=${caseId}`,
		method: 'post',
		data
	})
}

// 查询订单列表
export function queryOrderList(pageNo, pageSize, data) {
	return httpRequest({
		url: `/vlog/queryOrderList?pageNo=${pageNo}&pageSize=${pageSize}`,
		method: 'post',
		data
	})
}


// 查询Vlog生成情况
export function queryVlog(data) {
	return httpRequest({
		url: `/vlog/queryVlog`,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}


// 获取个人信息
export function getUserInfo(data) {
	return httpRequest({
		url: '/wxuser/getUserInfo',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	});
}

// 创建视频下载订单
export function submitOrder(data) {
	return httpRequest({
		url: '/vlog/submitOrder',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	});
}

// 查询产品列表
export function getProductList(data) {
	return httpRequest({
		url: '/smartIndex/showProductList',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post'
	});
}

// 查询产品详情
export function getProductDetail(data) {
	return httpRequest({
		url: '/sysProduct/queryProductDetail',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post'
	});
}

// 购卡检查
export function checkForBuyCard(data) {
	return httpRequest({
		url: '/wxusercard/checkForBuyCard',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	});
}

// 购买产品
export function postBuyCard(data) {
	return httpRequest({
		url: '/wxusercard/buyCard',
		data,
		method: 'post'
	});
}

// 微信支付
export function miniWxPay(data) {
	return httpRequest({
		url: '/weixin/pay',
		data,
		method: 'get'
	});
}

// 激活会员检查
export function checkForBindCard(data) {
	return httpRequest({
		url: '/wxusercard/checkForBindCard',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}
// 激活卡片
export function postBindCard(data) {
	return httpRequest({
		url: '/wxusercard/bindCard_new',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post'
	});
}


// 优惠券
export function queryCoupon() {
	return httpRequest({
		url: '/vlog/queryCoupon',
		method: 'post'
	});
}

// vlog支付
export function vlogPay(data) {
	return httpRequest({
		url: '/vlog/pay',
		method: 'GET',
		data
	});
}

// 免费下载
export function freeDownload(data) {
	return httpRequest({
		url: '/vlog/freeDownload',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	});
}

//获取城市列表
export function getCityList(data) {
	return httpRequest({
		url: '/wxscenic/getCityListByGroup',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post'
	});
}


//获取省列表
export function getProvinceListByGroup(data) {
	return httpRequest({
		url: '/wxscenic/getProvinceListByGroup',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post'
	});
}

//定位省
export function getLocationProvince(data) {
	return httpRequest({
		url: '/wxscenic/getLocationProvince',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post',
		
	});
}

//获取文章详情
export function getSysArticleDetail(data) {
	return httpRequest({
		url: '/wxactivity/getSysArticleInfo',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 订单详情
export function queryOrderDetail(data) {
	return httpRequest({
		url: '/vlog/queryOrderDetail',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 会员卡支付
export function vlogCardPay(data) {
	return httpRequest({
		url: '/vlog/card/pay',
		method: 'GET',
		data
	})
}

// 活动中心
export function getActivityList(data) {
	return httpRequest({
		url: '/wxactivity/getActivityList',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 活动中心详情
export function getActivityInfo(data) {
	return httpRequest({
		url: '/wxactivity/getActivityInfo',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}
// 活动中心阅读次数统计
export function slideShowView(data) {
	return httpRequest({
		url: '/wxactivity/addSlideShowView',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	})
}

// 查询订单，优惠券数量
export function queryCount() {
	return httpRequest({
		url: '/vlog/queryCount',
		method: 'GET'
	})
}

//获取首页轮播图
export function getSlideShowList(data) {
	return httpRequest({
		url: '/wxactivity/getSlideShowList',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data,
		method: 'post'
	});
}

// 景区详情
export function queryScenicDetail(data) {
	return httpRequest({
		url: '/vlog/queryScenicDetail',
		data,
		method: 'get'
	});
}

// 拍照开关
export function checkFaceSwitch(data) {
	return httpRequest({
		url: '/vlog/checkFaceSwitch',
		data,
		method: 'get'
	});
}
// 免费购买视频
export function freePay(data) {
	return httpRequest({
		url: '/vlog/freePay',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	});
}

// 打卡点
export function queryVlogScenicDetail(data) {
	return httpRequest({
		url: '/vlog/queryVlogScenicDetail',
		method: 'GET',
		data
	});
}

// 更新用户微信昵称信息
export function updateUserNickName(data) {
	return httpRequest({
		url: '/wxuser/updateUserNickName',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'post',
		data
	});
}