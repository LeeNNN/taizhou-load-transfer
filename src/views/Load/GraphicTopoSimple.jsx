import React, { useState, useEffect, useRef, useCallback } from "react"
import { symbolSimpleTypes as symbolTypes, nameTypes as types } from "@/utils/constant"
import { Message } from "antd"
import echarts from "echarts2/lib/echarts"
import "echarts2/lib/chart/tree"
import "echarts2/lib/component/tooltip"
import "echarts2/lib/component/title"
import "zrender/lib/svg/svg"

const options = {
  tooltip: {
    trigger: "item",
    triggerOn: "mousemove",
    backgroundColor: "rgba(245, 245, 245, 0.75)",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    textStyle: {
      color: "#172341"
    },
    formatter({
      data: { name = "", type = 1, feederName = null, isOutsideDevice = false, isRepeatDevice = false }
    }) {
      if (type === 0) return `起始点：${feederName}`
      let title = isOutsideDevice
        ? `${types[type]}(外部设备)`
        : isRepeatDevice
        ? `${types[type]}(重复设备)`
        : type % 1000 === 7
        ? "外部线路"
        : types[type % 1000]
      return `${title}：${name}<br/>${feederName ? "所属馈线：" + feederName : ""}`
    }
  },
  series: {
    type: "tree",
    data: [],
    top: "2%",
    left: "3%",
    bottom: "5%",
    right: "5%",
    symbol: (value, { data }) => {
      // 初始节点 或者 外部线路接地那
      if (data.start || data.type % 1000 === 7) return "rect"

      const { isRepeatDevice, isOutsideDevice } = data
      let type = data.newType || data.TYPE || data.type || "emptyCircle"
      if (isOutsideDevice) {
        type += 60
      } else if (isRepeatDevice) {
        type += 20
      } else if (data.isValid && data.isPower) {
        //
        type += 200
      }
      if (type === 4 || type === 5 || type === 6) {
        // 162上的服务暂时没有point字段
        // console.log(data.point, symbolTypes[type][+data.point], type)
        const point = data.point === 0 ? 2 : 1
        return symbolTypes[type][point]
      }
      return symbolTypes[type]
    },
    roam: true,
    symbolSize: (value, { data }) => {
      let size = 48
      // 初始节点
      if (data.start) size = [48, 36]
      // 外部线路节点
      if (data.type % 1000 === 7) size = [36, 24]
      return size
    },
    initialTreeDepth: -1,
    expandAndCollapse: false,
    label: {
      normal: {
        show: true,
        position: "bottom",
        verticalAlign: "middle",
        formatter: "{b}",
        rotate: 90,
        align: "right",
        fontSize: 10,
        color: "#fff"
      }
    },
    leaves: {
      label: {
        normal: {
          show: true,
          position: "right",
          verticalAlign: "middle",
          rotate: 0,
          align: "left",
          color: "#fff"
        }
      }
    },
    animationDurationUpdate: 750,
    itemStyle: {
      color: "#172341",
      borderColor: "#53f8ea",
      borderWidth: 3
    },
    lineStyle: {
      color: "#f44940"
    }
  },
  animation: false
}
let myCharts = null

const isDiffObject = (old, newArr) => {
  return JSON.stringify(old) !== JSON.stringify(newArr)
}

/**
 * @param {nodes} 需要设置的节点
 * @param {isPower} 断开节点和链接节点 0：断开  1：闭合
 */
const setAllNodeType = (nodes, isPower = 0) => {
  if (nodes.length) {
    nodes.forEach(node => {
      // 需要保证所有子节点的是否断电的状态跟当前点击的节点一致
      // 只有当前线路内部设备允许断、供电
      if (!node.isOutsideDevice) {
        node.isPower = !isPower
        if (!isPower) {
          node.type = (node.type % 1000) + 1000
        } else {
          // 恢复所有设备节点的失效状态为false
          node.isValid = false
          node.type = node.type > 1000 ? node.type - 1000 : node.type
        }
      }
      if (node.children && node.children.length) {
        setAllNodeType(node.children, isPower)
      }
    })
  }
}

/**
 * 查找指定id的节点的父节点
 */
const checkParent = (() => {
  let target = null
  return (nodes, id) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id && nodes[i].id === id) {
        target = nodes[i]
        return
      }
      if (nodes[i].children && nodes[i].children.length) checkParent(nodes[i].children, id)
    }
    return target
  }
})()

/**
 * 查找子节点
 */
const queryChild = (() => {
  let hasChild = false
  return (nodes, id) => {
    if (!id) return false
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id && nodes[i].id === id) {
        hasChild = true
        return hasChild
      }
      if (nodes[i].children && nodes[i].children.length) queryChild(nodes[i].children, id)
    }
    return hasChild
  }
})()

let operatorNodes = []

export default props => {
  const refCharts = useRef()
  const data = props.data
  const [list, setList] = useState([])
  const { depth, handleLoading, handleCurrentNode } = props

  const checkParentIsPower = useCallback((id, nodes) => {
    let parent = checkParent(nodes, id)
    // console.log("=========", parent)
    if (parent && parent.isOutsideDevice) parent = checkParent(nodes, parent.parentId)
    return parent
  }, [])

  const queryChildrenIncludes = useCallback((id, nodes) => {
    return queryChild(nodes, id)
  }, [])

  const handleNode = useCallback(
    devices => {
      handleCurrentNode(devices)
    },
    [handleCurrentNode]
  )

  useEffect(() => {
    if (isDiffObject(list, data)) {
      setList(data)

      if (myCharts) myCharts.clear()
    }
    options.series.data = data
    if (depth > 6) options.series.width = depth * 120
    if (!myCharts) myCharts = echarts.init(refCharts.current, null, { renderer: "svg" })
    myCharts.clear()
    myCharts.setOption({ ...options }, true, false)
    myCharts.resize()

    // 重置保存的被选中节点
    operatorNodes = []

    myCharts.on("click", function({ data }) {
      Message.destroy()
      // topo图的起点 不允许进行断、供电操作
      if (data.start) {
        Message.error("当前节点为该线路起点，不允许进行断、供电操作！")
        return false
      }
      // 外部设备，不允许进行断、供电操作
      if (data.isOutsideDevice) {
        Message.error("当前节点为外部设备，不允许进行断、供电操作！")
        return false
      }
      // console.log(data.type % 1000)
      if (data.type % 1000 !== 6 && data.type % 1000 !== 5 && data.type % 1000 !== 4) {
        Message.error("当前节点非刀闸或者开关，不允许进行断、供电操作！")
        return false
      }
      // 判断当前节点的是否断电 如果断电 查找父节点是否断电 如果父节点也处于断电状态 禁止操作
      // data.parentId用于判断当前设备是不是当前topo图的起点
      if (data.isPower) {
        const option = myCharts.getOption()
        const parent = checkParentIsPower(data.parentId, option.series[0].data)
        if (parent && parent.isPower) {
          Message.error("当前设备处于整条断电线路上，无法恢复供电状态，请查找断电设备起点，恢复供电！")
          return false
        }
      }
      if (data.point === 0) {
        data.current = !data.current
        data.point = 1
        myCharts.resize()
        return false
      }
      // console.log("=====data .point:", data)co
      data.isValid = !data.isValid
      // console.log("当前点击的节点:", data)
      // 设置当前节点的供电状态，更改数据
      setAllNodeType([data], data.isPower)

      // 处理当前已经选中的节点，如果有节点出现在新选中的节点的子节点当中，则删除掉之前选中的
      if (data.isPower) {
        for (let i = 0; i < operatorNodes.length; i++) {
          let node = operatorNodes[i]
          if (JSON.stringify(data).includes(JSON.stringify(node))) node.is = true
        }
        operatorNodes = operatorNodes.filter(node => !node.is)
        operatorNodes.push(data)
      } else {
        operatorNodes.forEach((node, index) => {
          if (node.id === data.id) operatorNodes.splice(index, 1)
        })
      }

      // 透传当前选中的参数给父组件
      handleNode(operatorNodes.map(node => ({ name: node.name, id: node.rdfId })))

      // 重置当前topo图 图标
      myCharts.resize()
    })
    window.addEventListener("resize", myCharts.resize)

    return () => {
      // 返回函数相当于 componentWillUnmount
      myCharts.off("click")
      myCharts.clear()
      myCharts = null
    }
  }, [data, list, depth, handleLoading, checkParentIsPower, handleNode, queryChildrenIncludes])

  return <div className="echarts" ref={refCharts} style={{ height: "calc(100% - 40px)" }} />
}
