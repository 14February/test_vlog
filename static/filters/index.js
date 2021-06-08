import App from '@/App'

const Filters = {
	distanceFormat(distance) {
		var m = '';
		if (distance / 1000 >= 1) {
			m = (distance / 1000).toFixed(2) + 'km'
		} else {
			m = distance + 'm'
		}
		return m;
	},
	introductionFormat(str) {
		const tag = '<'
		while (str.indexOf(tag) != -1) {
			var index1_ = str.indexOf(tag)
			var str1 = str.substring(0,index1_)
			var str2 = str.substring(index1_,str.length)
			var index2_ = str2.indexOf('>')
			str2 = str2.substring(index2_ + 1,index2_.length)
			str = str1 + str2
		}
		return str
	},
	imgUrlFormat(url) {
		return App.globalData.imgUrl + url
	},
	dateFormat(time,format) {
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
	},
	weekFormat(d) {
		const weekList = ['日','一','二','三','四','五','六']
		return weekList[d]
	},
	durationFormat(t) {
		t = t / 1000
		const hh = Math.floor(t / 60 / 60)
		const mm = Math.floor(t / 60) % 60
		const ss = Math.floor(t % 60)
		return hh ? `${hh}时${mm}分${ss}秒` : mm ? `${mm}分${ss}秒` : `${ss}秒`
	},
	scnienTypeFormat(scnienType) {
		if (scnienType === '3A景区') {
			return '3A'
		}
		if (scnienType === '4A景区') {
			return '4A'
		}
		if (scnienType === '5A景区') {
			return '5A'
		}
		if (scnienType === '主题乐园') {
			return '主题乐园'
		}
	}
}

export default Filters
