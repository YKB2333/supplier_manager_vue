import axios from '@/utils/request'

export function getChannelType() {
  return axios.get(`/goods/channel/findAll`)
}

export function getDepartmentList() {
  return axios.get(`/goods/channel/departmentList`)
}

export function getDanweiList() {
  return axios.get(`/goods/channel/danweiList`)
}
