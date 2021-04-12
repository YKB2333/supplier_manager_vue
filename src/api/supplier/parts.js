import axios from '@/utils/axios'

// 供应商获取所有配件信息
export function findAll() {
  return axios.get('/supplier/parts/findAll')
}
// 供应商添加配件分类
export function addPartsCategory(data) {
  return axios.post(`/supplier/parts/addPartsCategory`,data)
}
// 供应商修改配件分类
export function update(data) {
  return axios.post(`/supplier/parts/update`,data)
}
// 供应商id删除配件分类
export function delById(id) {
  return axios.post(`/supplier/parts/delById`,id)
}
// 根据id获取配件分类
export function getById(id) {
  return axios.post(`/supplier/parts/getById`,id)
}
// 根据编码获取配件分类
export function getByCode(code) {
  return axios.post(`/supplier/parts/getByCode`,code)
}
