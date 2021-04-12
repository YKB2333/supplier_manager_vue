import axios from '@/utils/axios'

export function uploadOss(data) { // 上传文件
  return axios.post('uploadSupplierAtta', data)
}