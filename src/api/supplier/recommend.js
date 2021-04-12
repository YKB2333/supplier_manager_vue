import axios from '@/utils/axios'

// 供应商推荐商品分页列表
export function selectPage(data) {
  return axios.post('/supplier/recommend/selectPage',data)
}
// 根据id获取供应商推荐商品
export function getById(id) {
  return axios.get(`/supplier/recommend/getById/${id}`)
}
// 根据id获取供应商推荐商品草稿
export function getModifyById(id) {
  return axios.get(`/supplier/recommend/getModifyById/${id}`)
}
// 根据用户ID、商品ID获取供应商推荐商品草稿
export function getModifyByUser(data) {
  return axios.post(`/supplier/recommend/getModifyByUser`, data)
}
// 根据获取所有供应商列表
export function getAllSup() {
  return axios.get(`/supplier/recommend/getAllSup`)
}
// 添加供应商推荐商品
export function saveRecommend(data) {
  return axios.post(`/supplier/recommend/saveRecommendProduct`,data)
}
// 修改供应商推荐商品
export function updateRecommend(data) {
  return axios.post(`/supplier/recommend/updateRecommendProduct`,data)
}
// 根据id删除供应商推荐商品
export function delById(id) {
  return axios.delete(`/supplier/recommend/delRecommendProductById/${id}`)
}

// 根据搜索导出供应商推荐物料报表。
export function exportInfo(params) {
  return axios.post(`/supplier/recommend/export`, params, { responseType: 'blob' })
}
//批量导入值缓存
export function importRecommendProduct(formData) {
  return axios.post(`/supplier/recommend/importRecommendProduct`, formData)
}

//批量导入
export function batchUpdateRecommendProduct(formData) {
  return axios.post(`/supplier/recommend/batchUpdateRecommendProduct`, formData)
}
// 提交推荐物料审批
export function sendApprove(id) {
  return axios.put(`/supplier/approval/recommend/sendApproval/${id}`)
  }
// 根据id修改物料状态为正常
export function sale(id) {
  return axios.put(`/supplier/recommend/sale/${id}`)
}
// 根据id修改物料状态为异常
export function outSale(id) {
  return axios.put(`/supplier/recommend/outSale/${id}`)
}
// 根据id修改物料状态为异常
export function reset(id) {
  return axios.put(`/supplier/recommend/reset/${id}`)
}

// 根据id获取供应商推荐商品审批记录
export function getApproveLogById(id) {
  return axios.get(`/supplier/recommend/getRecProApproveLogByProductId/${id}`)
}

// 根据id获取供应商推荐商品审批记录
export function fieldDetection(supId,productId) {
  return axios.get(`/supplier/recommend/filedDetection/${supId}/${productId}`)
}

// 根据id获取供应商推荐商品审批记录
export function searchSpu(data) {
  return axios.post(`/supplier/recommend/searchSpu`,data)
}

// 根据供应商ID获取内部联系人列表
export function getInnerPersonBySupId(supId) {
  return axios.get(`/supplier/innerPerson/list/${supId}`)
}