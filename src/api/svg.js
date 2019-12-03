import request from "@/utils/request"
import { INTERFACE_SVG, CONFESSION_ANALYSIS } from "./REQUEST_PATH"

export const getSvg = (lineId = "115967692082515772") => {
  return request.get(INTERFACE_SVG, { lineId })
}

export const confessionAnalysis = (lineId = "", deviceId = "") => {
  return request.get(CONFESSION_ANALYSIS, { lineId, deviceId })
}