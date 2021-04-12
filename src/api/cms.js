import axios from '@/utils/axios'

// 资讯分页查询
export const selectInfoPage = (data) => axios.post(`/supplier/cmsInfo/selectInfoPage`, data)

// 根据资讯id获取附件列表
export const getInfoAttachmentList = (ids) => axios.post(`/supplier/cmsInfo/listAttachmentCountByInfoIds`, ids)

// 删除附件
export const deleteAtta = (id) => axios.delete(`/supplier/cmsInfo/delAttachment/${id}`)

// 附件列表
export const getAttaList = (infoId) => axios.get(`/supplier/cmsInfo/listAttachmentByInfoId/${infoId}`)

// 添加附件
export const addAttachment = (data) => axios.post(`/supplier/cmsInfo/addAttachment`, data)

// 附件上传
export const uploadAtta = (formData) => axios.post(`/supplier/cmsInfo/uploadIfAtta`, formData)

// 删除资讯
export const deleteInfo = (id) => axios.delete(`/supplier/cmsInfo/delInfo/${id}`)

// 获取资讯详情
export const getInfoOne = (id) => axios.get(`/supplier/cmsInfo/getInfoOne/${id}`)

// 资讯图片上传
export const uploadIfImages = (formData) => axios.post(`/supplier/cmsInfo/uploadIfImages`, formData)

// 添加资讯
export const addInfo = (data) => axios.post(`/supplier/cmsInfo/addInfo`, data)

// 修改资讯
export const updateInfo = (data) => axios.post(`/supplier/cmsInfo/updateInfo`, data)

// 查询栏目列表
export const selectInfoCategoryPage = (data) => axios.post(`/supplier/cmsInfo/selectInfoCategoryPage`, data)


