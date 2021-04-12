import axios from '@/utils/request'

export function getVersionPage(data) { // 分页获取版本列表
  return axios.post(`/version/supplier/page`, data)
}

export function saveVersion(data) { // 三大中心-应用版本信息新增接口
  return axios.post(`/version/supplier/save`, data)
}

export function deleteVersion(ids) { // 三大中心 - 应用版本信息删除接口 批量
  return axios.put(`/version/delete`, ids)
}

export function getVersion(id) { // 三大中心 - 应用版本信息删除接口 批量
  return axios.get(`/version/get/${id}`)
}

export function updateVersion(data) { // 三大中心 - 应用版本信息删除接口 批量
  return axios.post(`/version/supplier/update`, data)
}

// /version / update
// 三大中心 - 应用版本信息更新接口