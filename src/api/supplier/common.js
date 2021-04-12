import axios from '@/utils/axios'

export function msgPage(data) {
  return axios.post(`/common/msg/msgPage`, data)
}

export function msgDetail(id, agent) {
  return axios.get(`/common/msg/msgDetail/${id}?agent=${agent}`)
}

export function replyList(msgId) {
  return axios.get(`/common/msg/replyList/${msgId}`)
}

export function replyAdd(data) {
  return axios.post(`/common/msg/replyAdd`, data)
}

export function replyDelete(id) {
  return axios.delete(`/common/msg/replyDelete/${id}`)
}

export function getSupInfoByUserId(userId) {
  return axios.get(`/supplier/info/getSupInfoByUserId/${userId}`)
}

export function noticePage(data) {
  return axios.post(`/common/msg/noticePage`, data)
}

export function noticeSave(data) {
  return axios.post(`/common/msg/notice/add`, data)
}

export function msgDelete(id) { 
  return axios.delete(`/common/msg/msgDelete/${id}`)
}

export function msgAdd(data) {
  return axios.post(`/common/msg/msgAdd`, data)
}

