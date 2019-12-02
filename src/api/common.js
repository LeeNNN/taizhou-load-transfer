import request from "@/utils/request"

import { GET_TREE_DATA, INTERFACE_TOPO } from "./REQUEST_PATH"

export const getTreeData = (areaId = "113715891127975944") => {
  return request.get(GET_TREE_DATA, { areaId })
}

export const getTopologyTree = (lineId = "115967692082511873") => {
  return request.get(INTERFACE_TOPO, { lineId })
}
