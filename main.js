import Vue from 'vue'
import App from './App'
import Filters from '@/static/filters'
import logo from '@/components/logo/index.vue'
import tabBar from '@/components/tabBar/index.vue'

//引入vuex
import store from './store';

//引入分享
import share from '@/static/utils/share'

Vue.component('tab-bar', tabBar)
Vue.component('logo', logo)

//全局注册过滤器
Object.keys(Filters).forEach(k => Vue.filter(k, Filters[k]))

Vue.config.productionTip = false
Vue.mixin(share)

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
