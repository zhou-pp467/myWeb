import axios from 'axios'
import { types } from '../redux/auth'
import { store } from '../index'
import { message } from 'antd'
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  response => {
    //对响应数据做操作
    if (parseInt(response.data, 10) === '200') {
      //console.log('请求成功');
      return response
    }
    if (response.data === '401' || response.data === 401) {
      message.error('登录已过期，重新登陆')
      store.dispatch({ type: types.LOGOUT })
      return Promise.reject(response)
    }
    if (response.data === 500 || response.data === '500') {
      console.log('请求失败', response.data)
      message.error('请求失败')
      //   alert(response.data.message)
      return Promise.reject(response)
    }
    return response
  },
  error => {
    //对响应数据错误做操作
    console.log('请求error', error)
    return error
  }
)

export default axios
