import axios from '@/utils/axios'

export function selectSupInfoPage(data) { 
  return axios.post('/supplier/modifyLog/selectSupInfoPage',data)
}
// 获取最后资料变更日志
export function lastModify(id) { 
  return axios.get(`/supplier/modifyLog/lastModify/${id}`)
}
// 通过供应商资料审批
export function enable(data) { 
  return axios.put(`/supplier/modifyLog/enable`, data)
}
// 拒绝供应商资料审批
export function disEnable(data) { 
  return axios.put(`/supplier/modifyLog/disEnable`, data)
}