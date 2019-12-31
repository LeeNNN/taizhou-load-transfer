import React, { useState, useEffect, useRef } from "react"
import { symbolTypes, nameTypes as types } from "@/utils/constant"
import echarts from "echarts/lib/echarts"
import "echarts/lib/chart/tree"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"
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
    //  { name = "", type = 1, feederName = null, isOutsideDevice=false,isRepeatDevice=false }
    formatter({
      data: { name = "", type = 1, feederName = null, isOutsideDevice = false, isRepeatDevice = false }
    }) {
      if (type === 0) return `起始点：${feederName}`
      let title = isOutsideDevice
        ? `${types[type]}(外部设备)`
        : isRepeatDevice
        ? `${types[type]}(重复设备)`
        : types[type]
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
      }
      return symbolTypes[type]
    },
    roam: true,
    symbolSize: (value, { data }) => (data.start ? [48, 36] : 20),
    initialTreeDepth: -1,
    width: 2000,
    label: {
      normal: {
        show: false,
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
          show: false,
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
    }
  }
}
let myCharts = null

const isDiffObject = (old, newArr) => {
  return JSON.stringify(old) !== JSON.stringify(newArr)
}
/*
const findSameNodes = (currentNode, arr) => {
  arr.forEach((node, idx) => {
    node.newType = null
    if (node.id === currentNode.id && JSON.stringify(currentNode.children) !== JSON.stringify(node.children)) {
      // console.log("相同的id：", node)
      node.newType = node.type + 20
      currentNode.newType = node.type + 20
    }
    if (node.children && node.children.length) {
      findSameNodes(currentNode, node.children)
    }
  })
} */

export default props => {
  const refCharts = useRef()
  const data = props.data
  const [list, setList] = useState([])
  const { depth, handleLoading } = props
  useEffect(() => {
    if (isDiffObject(list, data)) {
      setList(data)
      if (myCharts) myCharts.clear()
    }
    options.series.data = data
    options.series.width = depth * 72
    // console.log(options.series)
    if (!myCharts) myCharts = echarts.init(refCharts.current, null, { renderer: "svg" })
    myCharts.clear()
    myCharts.setOption({ ...options }, true, false)
    // myCharts.resize()
    // myCharts.on("click", function (params) {
    //   // data[0].type = 2
    //   // options.series.data = data
    //   // const currentNode = params.data
    //   // findSameNodes(currentNode, data)
    //   // myCharts.setOption({ ...options })
    //   myCharts.resize()
    // })
    window.addEventListener("resize", myCharts.resize)
    myCharts.on("finished", () => {
      handleLoading()
    })
    return () => {
      // 返回函数相当于 componentWillUnmount
      myCharts.off("click")
      myCharts.clear()
      myCharts = null
    }
  }, [data, list, depth, handleLoading])

  return <div className="echarts" ref={refCharts} style={{ height: "calc(100% - 40px)" }} />
}
