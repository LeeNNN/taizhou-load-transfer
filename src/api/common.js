import request from "@/utils/request"

import { GET_TREE_DATA, INTERFACE_TOPO, CONFESSION_ANALYSIS_ALL } from "./REQUEST_PATH"

// 获取页面左侧的树结构
export const getTreeData = () => {
  return request.get(GET_TREE_DATA)
}

export const getTopologyTree = (lineId = "115967692082511873") => {
  return request.get(INTERFACE_TOPO, { lineId })
}

export const analysisLineConfession = (lineId, startDate, endDate) => {
  return request.post(CONFESSION_ANALYSIS_ALL, { lineId, startDate, endDate })
}
