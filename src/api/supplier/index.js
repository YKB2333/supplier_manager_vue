import axios from '@/utils/axios'

// 获取供应商提供的物料类型
export function getSupTypes() {
  return axios.get('/supplier/info/getSupTypes')
}
// 根据id获取供应商信息
export function getSupInfoById(id) {
  return axios.get(`/supplier/info/getSupInfoById/${id}`)
}
// 供应商分页列表
export function selectSupInfoPage(data) {
    return axios.post('/supplier/info/selectSupInfoPage',data)
}
// 保存供应商信息
export function saveSupInfo(data) {
    return axios.post('/supplier/info/saveSupInfo',data)
}
// 更新供应商信息
export function updateSupInfo(data) {
  return axios.post('/supplier/info/updateSupInfo',data)
}
// 供应商建档审核申请
export function checkApply(id) {
  return axios.put(`/supplier/info/checkApply/${id}`)
}
// 启用供应商
export function enable(id) {
  return axios.put(`/supplier/info/enable/${id}`)
}
// 停用供应商
export function disEnable(id) {
  return axios.put(`/supplier/info/disEnable/${id}`)
}
//获取所有公司
export function getAllCompanyInfo(data) { // 获取所有公司
  return axios.get('/ecology-user/getAllCompanyInfo', data)
}
export function getJobTitleById(data) { // 根据id获取负责内容信息
  return axios.get(`/ecology-user/getJobTitleById/${data}`)
}
export function getAllEcologyUsers(data) { // 获取所有泛微用户
  return axios.get('/ecology-user/getAllEcologyUsers', data)
}

//供应商发起准入流程
export function applySupplier(param) {
  return axios.post(`/supplier/info/applySupplier`, param)
}
export function uploadSupplierAtta(data) { // 合同附件上传
  return axios.post('/uploadSupplierAtta', data)
}
// 获取改进计划
export function getImprovePlan(supId) {
  return axios.post(`/supplier/info/getImprovePlan/${supId}`)
}

// 取消准入
export function doAbandan(data) {
  return axios.post(`/supplier/info/doAbandon`,data)
}

export function findAllBankCategory(data) { // 银行类型
  return axios.get('/customer/nc-bank-category/getAllNcBankCategory')
}

export function danweiList (data) { // NC计量单位
  return axios.get('/goods/channel/danweiList')
}
export function checkSupInfoName (data) { // 校验供应商名称是否已存在
  return axios.post(`/supplier/info/checkSupInfoName`,data)
}

//内部联系人接口
export function getInnerPersonInfoListByBId(data) { // 供应商中心-内部联系人信息列表
  return axios.get(`/supplier/info/getInnerPersonInfoListByBId/${data}`)
}
export function addInnerPersonInfoById(data) { // 供应商中心-新增内部联系人信息
  return axios.post(`/supplier/info/addInnerPersonInfoById/`,data)
}
export function updateInnerPersonInfoById(data) { // 供应商中心-修改内部联系人信息
  return axios.post(`/supplier/info/updateInnerPersonInfoById/`,data)
}
export function delInnerPersonInfoById(data) { // 供应商中心-删除内部联系人信息
  return axios.delete(`/supplier/info/delInnerPersonInfoById/${data}`)
}


