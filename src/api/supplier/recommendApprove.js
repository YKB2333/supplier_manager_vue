import axios from '@/utils/axios'

// 供应商推荐商品分页列表
export function selectPage(data) {
  return axios.post('/supplier/approval/recommend/approvePage',data)
}
// 供应商推荐商品审批通过
export function enable(data) {
  return axios.put('/supplier/approval/recommend/enable',data)
}
// 供应商推荐商品审批不通过
export function disable(data) {
  return axios.put('/supplier/approval/recommend/disable',data)
}
// 供应商审批日志
export function getApproveLogList(data) {
  return axios.post(`/supplier/approval/recommend/page`, data)
}