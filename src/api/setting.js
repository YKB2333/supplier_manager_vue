import axios from '@/utils/axios'

export function qywxUserReflush(agent) {
  return axios.put(`/goods/setting/qywxUser/reflush/${agent}`)
}
