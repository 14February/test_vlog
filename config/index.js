/**
 * 所有的配置文件
 */
export const config = {
	devHost:'https://zqwl-tour.cytsszt.com/tour-product', // 正式库
	// devHost:'https://zqwl-tour-test.cytsszt.com/tour-product', // 测试库
	// devHost:'http://localhost:8081/tour-product', // 测试库
	// devHost: 'https://gateway.yunguzhiyou.com/tour-product',
	appId: "1",
	key: "1112",
	productType: 6
}

export const api = config.devHost // 正在使用的域名链接
export const appId = config.appId // 正在使用的appid
export const key = config.key // 正在使用的md5加密key
export const productType = config.productType // 正在使用的产品id
export default {
	api,
  appId,
  key,
	productType
}