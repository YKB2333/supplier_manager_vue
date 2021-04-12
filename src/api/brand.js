import axios from '@/utils/axios'

export function getBrandList() { // 品牌列表
  return axios.get('/goods/brand/findAll')
}