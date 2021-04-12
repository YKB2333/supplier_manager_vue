import axios from '@/utils/axios'

export function getAttaListBySupId(supId) { // 根据供应商id获取附件列表
  return axios.get(`/supAtta/getBySupId/${supId}`)
}

export function addSupAttachment(supId, atta = {}) { // 添加供应商附件
  return axios.post(`/supAtta/addAttachment/${supId}`, atta)
}

export function deleteAtta(id) { // 删除附件
  return axios.delete(`/supAtta/delAttachment/${id}`)
}

