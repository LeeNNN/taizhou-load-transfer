import axios from "axios"
import { message } from "antd"
const service = axios.create({
  baseURL: "/" + process.env.REACT_APP_BASEURL
  // baseURL: "/api"
})

// 发送请求之前拦截，处理参数
service.interceptors.request.use(config => {
  // config.url = config.url + ".do"
  const { method } = config
  if (method.toUpperCase() === "GET") {
    config.params = { ...config.data }
    config.data = {}
  }
  return config
})

// 处理请求回来的数据
service.interceptors.response.use(data => {
  if (data.status === 200) {
    return Promise.resolve(data.data)
  } else {
    message.destroy()
    message.error("请求错误")
    Promise.reject(data)
  }
})

const request = (url, method = "GET", data = {}, headers = null) => {
  return new Promise((resolve, reject) => {
    service({
      url,
      method: method.toUpperCase(),
      data,
      headers
    }).then(res => {
      if (url.indexOf(".svg") > -1) {
        return resolve(res)
      }
      if (+res.resultCode === 1) {
        resolve(res.result)
      } else {
        message.destroy()
        message.error(res.resultMsg)
        reject(res)
      }
    })
  })
}

request.post = (url, data = {}) => request(url, "POST", data)
request.get = (url, data = {}) => request(url, "GET", data)

export const requestSvg = (url, data = {}) => {
  return request(url, "GET", data, { "content-type": "image/svg+xml" })
}

export default request