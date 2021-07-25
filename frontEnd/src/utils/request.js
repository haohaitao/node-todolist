import axios from 'axios'
import { message } from 'antd'
// 根据环境不同引入不同api地址
// create an axios instance
const service = axios.create({
  // baseURL: '', // url = base api url + request url
  // withCredentials: true // send cookies when cross-domain requests
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    return Promise.resolve(response)
  },
  error => {
    message.error('系统出现异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
