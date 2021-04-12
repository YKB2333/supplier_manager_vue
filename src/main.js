import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss' // global css
import '@/assets/icons' // icon
import './router/permission' // permission control
import * as filters from './filters' // global filters
import config from './config'
import VueBus from '@/utils/bus'
Vue.config.productionTip = false
Vue.use(Element, { size: config.elementSize })
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import lodash from 'lodash'
import request from '@/utils/request'
import axios from '@/utils/axios'
import instantCompt from './utils/instantComponent'
import comp from './components'
import importDirective from '@/directives'
/**
 * 注册指令
 */
importDirective(Vue)
Vue.prototype.$store = store
Vue.prototype.$config = config
Vue.prototype.$instantCompt = instantCompt
Vue.prototype.$http = axios
Vue.prototype.$http = request
Vue.prototype.$lodash = lodash
let dayjs = require('dayjs')
Vue.prototype.$dayjs = dayjs
Vue.prototype.$formatDate = require('./utils').formatDate
Vue.prototype.$formatFileSize = require('./utils').formatFileSize
Vue.prototype.$maxNumber = 2147483647
Vue.use(comp)
Vue.use(VueBus)

new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
})
