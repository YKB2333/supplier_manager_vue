
// console.log('env_config', process.env.VUE_APP_MODE)
module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  projectName: '供应商中心管理系统',
  // 项目唯一标识，用于本地数据存储时添加键前缀
  projectKey: 'supplier_manager_',
  // http请求超时时间（未使用）
  timeout: 60 * 1000,
  // 请求头里的token字段名
  headersTokenKey: 'GoodsAdminAuth',
  // cookie过期时间1天
  cookieExpires: 1,
}