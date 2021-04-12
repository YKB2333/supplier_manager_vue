import router from '../router'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import { projectName } from '@/config'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/getBackPassword'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // has token
    if (to.path === '/login') {
      // 如果是登录页，直接进入首页
      next({ path: '/' })
      NProgress.done() // 如果当前页是首页时不会触发afterEach hook,需要在这里结束进度条
    } else {
      if (store.getters.permission_routes.length === 0) {
        store.dispatch('generateRoutes').then(routes => {
          routes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          router.addRoutes(routes)
          next({ ...to, replace: true })
        })
          .catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({ path: '/login' })
              NProgress.done() // 如果当前页是首页时不会触发afterEach hook,需要在这里结束进度条
            })
          })
      } else {
        next()
      }
    }
  } else {
    // has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // 如果当前页是登录页时不会触发afterEach hook,需要在这里结束进度条
    }
  }
})

router.afterEach((to) => {
  NProgress.done() // finish progress bar
  if (to.meta.title) {
    document.title = `${to.meta.title}-${projectName}`
  }
})
