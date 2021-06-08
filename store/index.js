import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    latitude: "",
    longitude: "",
		province: "",
		city: '',
    orderInfo: {},
    scenicInfo: {},
    scenicInfo: {},
    punchInPoint: {}
  },
  // 同步执行
  mutations: {
    getLatitude(state, payload) {
      state.latitude = payload
    },
    getLongitude(state, payload) {
      state.longitude = payload
    },
    getProvinceName(state, payload) {
      state.province = payload
		},
		getCityName(state, payload) {
      state.city = payload
    },
    getOrderInfo(state, payload) {
      state.orderInfo = payload
    },
    getScenicInfo(state, payload) {
      state.scenicInfo = payload
    },
    getPunchInPoint(state, payload) {
      state.punchInPoint = payload
    }
  },
  // 能执行异步操作
  actions: {
    getLatitude(state, payload) {
      state.latitude = payload;
    },
    getLongitude(state, payload) {
      state.longitude = payload;
    },
    getProvinceName(state, payload) {
      state.province = payload;
		},
		getCityName(state, payload) {
      state.city = payload;
    },
    getOrderInfo(state, payload) {
      state.orderInfo = payload;
    },
    getScenicInfo(state, payload) {
      state.scenicInfo = payload
    },
    getPunchInPoint(state, payload) {
      state.punchInPoint = payload
    }
  }
})
