import axios from "axios"
import { message } from "antd"

message.config({
  top: 66,
  duration: 2
})

const CancelToken = axios.CancelToken
export let source = CancelToken.source()

const service = axios.create({
  baseURL: "/" + process.env.REACT_APP_BASEURL,
  timeout: 8000
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
    return data //data.data
  } else {
    message.destroy()
    message.error("请求错误")
    Promise.reject(data)
  }
})

const request = (url, method = "GET", data = {}, headers = null, responseType=null) => {
  return new Promise((resolve, reject) => {
    const req = {
      url,
      method: method.toUpperCase(),
      data,
      headers
    }
    if (responseType) {
      req.responseType = responseType
      req.headers = {
        ...req.headers,
        "Content-Type": "application/json; application/octet-stream; application/x-www-form-urlencoded"
      }
    }
    console.log("req", req)
    service(
      req,
      {
        cancelToken: source.token
      }
    ).then(response => {
      const {data: res} = response
      if (typeof res === "string") {
        return resolve(response)
      }
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
    }).catch(error => {
      reject(error)
    })
  })
}

request.post = (url, data = {}, responseType) => request(url, "POST", data, {}, responseType)
request.get = (url, data = {}) => request(url, "GET", data)

export const requestSvg = (url, data = {}) => {
  return request(url, "GET", data, { "content-type": "image/svg+xml" })
}

export default request
