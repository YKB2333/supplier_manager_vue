import constantRoutes from '@/router/constantRoutes'
import { getToken, setToken } from '@/utils/auth'
import { projectKey, projectName } from '@/config'
import { filterAsyncRouter, getterTreeArray } from '@/utils/permission'

const user = {
  state: {
    token: getToken(),
    roles: [],
    routes: [],
    userInfo: JSON.parse(localStorage.getItem(`${projectKey}userInfo`)) || null // 登录用户信息
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      localStorage.setItem(`${projectKey}userInfo`, JSON.stringify(userInfo))
    }
  },

  actions: {
    generateRoutes({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (!state.userInfo.menuList || !state.userInfo.menuList.length || !state.userInfo.menuList.find(key => key.name.localeCompare(projectName) === 0)) {
          commit('SET_ROUTES', constantRoutes)
          resolve([])
          return
        }
        try {
          const treeArray = getterTreeArray('id', 'pid', state.userInfo.menuList)
          const customerArray = treeArray.find(key => key.name.localeCompare(projectName) === 0)
          const accessedRoutes = filterAsyncRouter(customerArray.children)
          const concatRouter = constantRoutes.concat(accessedRoutes)
          commit('SET_ROUTES', concatRouter)
          resolve(accessedRoutes)
        } catch (error) {
          console.log(error)
          commit('SET_ROUTES', constantRoutes)
          resolve([])
        }
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USER_INFO', null)
        resolve()
      })
    }
  }
}

export default user
