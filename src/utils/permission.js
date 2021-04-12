import store from '@/store'
import Layout from '@/views/layout/Layout'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

// export const _import = (path) => () => import(`@/views/${path}`)
export const _import = (path) => resolve => require([`@/views/${path}`], resolve)

// 遍历后台传来的路由字符串，转换为组件对象
export function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(item => {
    getFormatItem(item)
    if (!item.component) return false
    // Layout组件特殊处理
    if (['layout', 'Layout'].includes(item.component)) {
      item.component = Layout
    } else {
      item.component = _import(item.component)
    }
    if (item.children && item.children.length) {
      item.meta.permission = item.children.filter(key => key.type === 2)
      item.children = filterAsyncRouter(item.children)
      if (item.children.length === 0) delete item.children
    }
    return true
  })
  return accessedRouters
}
function getFormatItem(items) {
  let item = items
  let metaTitle = item.name
  let meta = item.meta && JSON.parse(item.meta.replace(/\'/g, '"')) || {}
  let constantMeta = {
    title: metaTitle || '',
    noCache: meta.noCache || false,
    hideInTagsView: meta.hideInTagsView || false,
    icon: meta.icon || ''
  }
  item.meta = Object.assign(constantMeta, meta)
  item.path = item.routerPath || ''
  item.name = item.routerName || ''
  item.pos = item.pos || ''
  item.component = item.routerComponent || ''
  if (item.redirectUrl) item.redirect = item.redirectUrl
  item.hidden = !item.isShow
  return item
}

// 格式化路由列表 -不用
export const getFilterMenuByRouter = (list) => {
  const res = []
  list.forEach(item => {
    if (item.hidden) return
    if (hasChild(item)) {
      item.children = getFilterMenuByRouter(item.children)
    }
    res.push(item)
  })
  return res
}
//  判断有没有chilidren
export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

export function getterTreeArray(parentKey, subKey, data) {
  // 过滤父级 => 遍历获取子children => 判断有没有length、如果有递归
  let baseNodes = data.filter(item => !item[subKey])
  let toTreeArray = (nodeList, nodeData) => {
    nodeList.forEach(item => {
      let children = nodeData.filter(key => key[subKey] === item[parentKey])
      if (children.length > 0) {
        children.sort((a, b) => b.pos - a.pos)
        item.children = children
        toTreeArray(children, nodeData)
      }
    })
  }
  toTreeArray(baseNodes, data)
  return baseNodes
}
