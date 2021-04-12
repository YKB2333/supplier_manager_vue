import axios from '@/utils/axios'

export function getGoodsCategoryList() { // 商品分类列表
  return axios.get('/goods/category/findAll')
}
export function getPartsCategoryList() { // 配件分类列表
  return axios.get('/supplier/parts/findAll', )
}