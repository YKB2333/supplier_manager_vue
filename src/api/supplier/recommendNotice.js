import axios from '@/utils/axios'

// 供应商推荐商品分页列表
export function selectList(data) {
  return axios.post('/supplier/recommend/product/notice/list', data)
}
// 供应商推荐商品审批通过
export function sendNotice(data) {
  return axios.put('/supplier/recommend/product/notice/sendNotice', data)
}
