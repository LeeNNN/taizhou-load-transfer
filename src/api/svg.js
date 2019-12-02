import request from "@/utils/request"
import { INTERFACE_SVG } from "./REQUEST_PATH"

export const getSvg = (lineId = "115967692082515772") => {
  return request.get(INTERFACE_SVG, { lineId })
}