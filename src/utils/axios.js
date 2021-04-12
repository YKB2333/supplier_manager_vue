import Vue from 'vue'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { baseURL, timeout, headersTokenKey } from '@/config'
import { getToken } from '@/utils/auth'
import JSONbig from 'json-bigint'

const service = axios.create({
  baseURL: baseURL,
  // timeout: timeout
  transformResponse: [function (data) {
    return JSONbig.parse(data)
    //return data
  }],
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (getToken()) {
      // 请求时携带token
      config.headers[headersTokenKey] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error)
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log(response.headers)
    let _headersTokenKey = headersTokenKey.toLowerCase()
    if (response.headers[_headersTokenKey]) {
      let token = response.headers[_headersTokenKey]
      console.info('更新token', token)
      store.commit('SET_TOKEN', token)
    }
    if (response.status === 200) {
      if (response.config.responseType && response.config.responseType === 'blob') { // 下载附件
        return response.data
      } else {
        if (response.data.resultCode === '0') {
          return response.data.result
        } else {
          if (response.data.resultMsg) {
            Message.error(response.data.resultMsg)
            return Promise.reject(response.data.resultMsg)
          } else if (response.data.result) {
            Message.error(response.data.result)
            return Promise.reject(response.data.result)
          }
        }
      }
    } else {
      Message.error(response.status)
      return Promise.reject(response.status)
    }
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message.error('请求超时')
      return Promise.reject('请求超时')
    } else {
      // console.log('error=>', error.response) // for debug
      if (!error.response) {
        Message.error('网络连接出错')
        return Promise.reject('网络连接出错')
      } else {
        if (error.response.status === 401) {
          MessageBox({
            title: '登录过期',
            message: '请重新登录',
            showClose: false,
            callback: (ac) => {
              store.dispatch('LogOut').then(() => {
                location.reload() // 重新登录后路由重复添加问题
              })
            }
          })
          return Promise.reject('401')
        } else {
          let errorMsg
          if (error.response.data.resultMsg) {
            errorMsg = error.response.data.resultMsg
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message
            if (errorMsg.includes('Subject does not have permission')) {
              errorMsg = '无权限访问'
            }
          } else {
            if (error.response.config.responseType && error.response.config.responseType === 'blob') {
              errorMsg = '无下载权限'
            } else {
              errorMsg = error.response.status.toString()
            }
          }
          Message.error(errorMsg)
          return Promise.reject(errorMsg)
        }
      }
    }
  }
)

export default service
