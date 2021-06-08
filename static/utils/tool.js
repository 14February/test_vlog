/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatDate(time,format) {
	time = time.toString().indexOf('-') < 0 ? time : time.replace(/\-/g, "/")
		const date = new Date(time)
		const YYYY = date.getFullYear()
		const MM = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
		const DD = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
		const dd = date.getDay()
		const hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
		const mm = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
		const ss = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
		// 年
		if(format === 'YYYY') {
			return `${YYYY}`
		}
		// 月
		if(format === 'MM') {
			return `${MM}`
		}
		// 日
		if(format === 'DD') {
			return `${DD}`
		}
		// 周日
		if(format === 'dd') {
			return `${dd}`
		}
		// 年月
		if(format === 'YYYY-MM') {
			return `${YYYY}-${MM}`
		}
		// 月日
		if(format === 'MM-DD') {
			return `${MM}-${DD}`
		}
		// 时分秒
		if(format === 'YYYY-MM-DD'){
			return `${YYYY}-${MM}-${DD}`
		}
		// 时分秒
		if(format === 'hh-mm-ss'){
			return `${hh}:${mm}:${ss}`
		}
		// 年月日时分秒
		if(format === 'YYYY-MM-DD hh-mm-ss'){
			return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
		}
}
//api
//format(data,"yyyy-MM-dd hh:mm:ss");

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
	if (!search) {
		return {}
	}
	const obj = {}
	const searchArr = search.split('&')
	searchArr.forEach(v => {
		const index = v.indexOf('=')
		if (index !== -1) {
			const name = v.substring(0, index)
			const val = v.substring(index + 1, v.length)
			obj[name] = val
		}
	})
	return obj
}

/**
 * @param {string} phone
 * @returns {Object}
 */
export function checkPhone(phone) {
	if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
		return false;
	}
	return true;
}

/**
 * @param {string} cardNo
 * @returns {Object}
 */
export function checkCardNo(cardNo) {
	if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(cardNo)) {
		return true;
	} else if (/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/.test(cardNo)) {
		return true;
	}
	return false;
}

/**
 * @param {string} number
 * @returns string
 */
export function formatNum(f, digit) {
	var m = Math.pow(10, digit);
	return Math.round(f * m, 10) / m;
}

//过滤标签
export function filterTag(str,tag) {
	while (str.indexOf(tag) != -1) {
		var index1_ = str.indexOf(tag)
		var str1 = str.substring(0,index1_)
		var str2 = str.substring(index1_,str.length)
		var index2_ = str2.indexOf('>');
		str2 = str2.substring(index2_ + 1,index2_.length)
		str = str1 + str2
	}
	return str
}

//节流函数
export function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 3000
    }
 
    let _lastTime = null
    // 返回新的函数
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)   //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
}

// 定位
export function getLocation() {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			success: function (res) {
				uni.setStorageSync('latitude', res.latitude)
				uni.setStorageSync('longitude', res.longitude)
				resolve(res)
			},
			fail: function (err) {
				reject(err)
			}
		})
	})
}

// upx转px
export function transPx(upx) {
	const res = uni.getSystemInfoSync()
  return res.windowWidth * upx / 750
}

// 去标签化
export function introductionFormat(str, tag) {
  while (str.indexOf(tag) != -1) {
    var index1_ = str.indexOf(tag)
    var str1 = str.substring(0,index1_)
    var str2 = str.substring(index1_,str.length)
    var index2_ = str2.indexOf('>')
    str2 = str2.substring(index2_ + 1,index2_.length)
    str = str1 + str2
  }
  return str
}