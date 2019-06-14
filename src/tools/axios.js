import axios from 'axios'
import { Notification } from 'element-ui'
import NProgress from 'nprogress'
import router from './../router'

// 创建一个 axios 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 30000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    NProgress.start()
    // 在请求发送之前做一些处理
    const token = localStorage.getItem('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // const token = 'yJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsaVV5UmhkV3lYNzBYc1JPUEZUX0dtdnZzanYtYVhjaXNwckUxTHpyRjZFIn0.eyJqdGkiOiJjMWNlMWExNC05MWM3LTRjYjgtOTAzMC0zODg5NzBlNTJjZmEiLCJleHAiOjE1NTkwOTk0NTcsIm5iZiI6MCwiaWF0IjoxNTU4NjY3NDU3LCJpc3MiOiJodHRwOi8vc3NvLmppbnVvLm1lL2F1dGgvcmVhbG1zL0ppbnVvUHJpdmF0ZU5ldHdvcmsiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMjhiNmFmNWQtZDAyMC00YjY0LTljM2MtOTk4NGMyMmUyYWFkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibW9ja2VyIiwiYXV0aF90aW1lIjoxNTU4NjYzOTMwLCJzZXNzaW9uX3N0YXRlIjoiOWMwOWMyN2UtMTQ4MC00NGEyLThkMWYtYTY2MTc4ZTI3NzAxIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyJtb2NrZXIuamludW8ubWUiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IuaVrOaWhyDpgpMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkZW5namluZ3dlbiIsImdpdmVuX25hbWUiOiLmlazmlociLCJsb2NhbGUiOiJ6aC1DTiIsImZhbWlseV9uYW1lIjoi6YKTIiwiZW1haWwiOiJkZW5namluZ3dlbkBqaW51by5tZSJ9.KwesBeMq4CbEph9WdUwGT6hfJFSM8tjJy0kDi-tvOACsO6OeB43bqiJP8PeeuJ7TYzl8msvXDhPDU8JzMcGCemjTBjZwWjeRd3w20D-9lU-da5AFS_lyQ40LKDk2FYZSUtoaZw9H1QHrot6MyUe0gi3x7-66Qz6LYaxxwB-jh3zigtMJYOMExvUC8Lm8gFQ2gMEUmmrlgh0uC2n1tz7Bbnan523DapBy9ey0HUyS_fyO2VU2RTQZAdJNzp_NBQvJVdwlbdGBXippdiNC-lfoNus3TTfg4LiXNTFzrfJLuwzIqGCEMBG0_ICzjd6ylstkvfiDw_l8BFr_1aZg4tcSvg'
    config.headers['Authorization'] = 'Bearer ' + token
    // if(config.headers['Content-type'] === 'application/x-www-form-urlencoded;charset=UTF-8'){
    //   config.data = qs.stringify(config.data);
    // }
    return config
  },
  error => {
    // 发送失败
    NProgress.done()
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    NProgress.done()
    const dataAxios = response.data
    return dataAxios
  },
  error => {
    NProgress.done()
    console.log(error.response)
    if (error.response.status === 401) {
      Notification.error({
        title: '错误',
        message: '认证过期，请重新登录'
      })

      setTimeout(() => {
        localStorage.clear()
        router.push('/login')
      }, 1000)
    } else {
      // let msg = typeof error.response.data === 'object' ? error.response.data.message : '网络错误'
      // 请求错误时做些事
      Notification.error({
        title: '错误',
        message: error.response.statusText
      })
    }
    return Promise.reject(error)
  }
)

export default service
