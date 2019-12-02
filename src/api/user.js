import request from "@/utils/request"
import { DO_LOGIN, /* USER_KEY */ } from "./REQUEST_PATH"

export const doLogin = (account = "admin", password = "123456", ip = "47.96.88.114") => {
  return request.get(DO_LOGIN, { account, password, ip })
}

/* export const getUserKey = () => {
  return request.get(USER_KEY)
} */
