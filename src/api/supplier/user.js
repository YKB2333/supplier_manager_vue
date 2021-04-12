import axios from '@/utils/axios'
let Base64 = require('js-base64').Base64
import lodash from 'lodash'

// 供应商账号列表
export function supUserPage(data) {
  return axios.post(`/supplier/user/page`,data)
}
// 供应商账号创建
export function saveSupUser(data) {
  let param = lodash.cloneDeep(data)
  param.loginPassword = Base64.encode(param.loginPassword)
  return axios.post(`/supplier/user/save`,param)
}
// 启用供应商账号
export function enableSupUser(supId,userId) {
  return axios.patch(`/supplier/user/enable/${supId}/${userId}`)
}
// 禁用供应商账号
export function disableSupUser(supId,userId) {
  return axios.patch(`/supplier/user/disable/${supId}/${userId}`)
}
// 设置供应商主账号
export function beMasterSupUser(supId,userId) {
  return axios.patch(`/supplier/user/beMaster/${supId}/${userId}`)
}
// 删除供应商账号
export function removeSupUser(supId,userId) {
  return axios.delete(`/supplier/user/remove/${supId}/${userId}`)
}