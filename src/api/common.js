import request from "@/utils/request"

import { GET_TREE_DATA, INTERFACE_TOPO, CONFESSION_ANALYSIS_ALL, LINE_INVALID } from "./REQUEST_PATH"

// 获取页面左侧的树结构
export const getTreeData = () => {
  return request.get(GET_TREE_DATA)
}

export const getTopologyTree = (lineId = "115967692082511873", type = 1) => {
  return request.get(INTERFACE_TOPO, { lineId, type })
}

export const analysisLineConfession = (lineId, startDate, endDate) => {
  return request.post(CONFESSION_ANALYSIS_ALL, { lineId, startDate, endDate })
}
// 设置线路无效
export const setLineInvalid = (lineId) => {
  return request.post(`${LINE_INVALID}?lineId=${lineId}`)
}
// 导出所有配变
// export const exportTrData = (rdfIds) => {
//   return request.post("/model/exportTrData", {
//     rdfIds: JSON.stringify(rdfIds)
//   },
//   "arraybuffer"
//   )
// }

export const exportTrData = (rdfIds) => {
  return request.get("/model/exportTrData", { rdfIds: JSON.stringify(rdfIds) })
}
// 导出所有配变
// export const exportTrDataPost = (rdfIds) => {
//   return request.post("/model/exportTrDataPost", {
//     rdfIds: JSON.stringify(rdfIds)
//   },
//   "arraybuffer"
//   )
// }
// 显示配变
export const getExportTrData = (rdfIds) => {
  return request.post("/model/getExportTrData", {
    rdfIds: JSON.stringify(rdfIds)
  }
  )
}

