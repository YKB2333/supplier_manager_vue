import axios from '@/utils/axios'

export function getBrandList() { // ๅ็ๅ่กจ
  return axios.get('/goods/brand/findAll')
}