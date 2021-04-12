import Vue from 'vue'
import Router from 'vue-router'
import constantRoutes from './constantRoutes'
Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

