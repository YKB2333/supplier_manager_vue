import axios from '@/utils/axios'

// 根据id获取供应商合作商品
export function getCoopGoods(data) {
  return axios.post(`/supplier/cooperation/getCoopGoods`,data)
}
// 以供应商推荐物料建立合作关系
export function saveByExpectGoods(data) { 
  return axios.post(`/supplier/cooperation/save/byExpectGoods`,data)
}

// 获取所有供应商信息
export function getAllSuppliers() {
  return axios.get('/supplier/cooperation/getAllSuppliers')
}

// 获取已上架的SPU
export function getAllSup(data) {
  return axios.post('/customer/proAnalyze/publishedList',data)
}



// 根据id获取sku列表
export function getSkusByspuId(id) {
  return axios.post(`/supplier/cooperation/getSkusByspuId/${id}`)
}

// 新增合作商品
export function addCoopGoods(data) {
  return axios.post(`/supplier/cooperation/addCoopGoods/`,data)
}

// 禁用合作商品
export function disable(id) {
  return axios.post(`/supplier/cooperation/disable/${id}`)
}

// 恢复合作商品
export function enable(id) {
  return axios.post(`/supplier/cooperation/enable/${id}`)
}
// 编辑供应商推荐物料编码
export function updateSupplierCode(date) {
  return axios.post(`/supplier/cooperation/updateSupplierCode/`,date)
}

// 根据搜索条件获取供应商合作商品
export function getCoopGoodsBySearch(data) {
  return axios.post(`/supplier/cooperation/getCoopGoodsBySearch`,data)
}
