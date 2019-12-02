import React, { useState, useEffect, useRef } from "react"
import echarts from "echarts/lib/echarts"
import "echarts/lib/chart/tree"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"

const symbolTypes = {
  1: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAPFBMVEUAAAA6zrw6zrw6zrw6zrw6zrw6zryd597O8+7z/PtG0cD///9r2s3b9vOE4NWR5Nm27eap6uLn+fdT1MR9WjCFAAAABnRSTlMA4KCQUEA6bX1/AAAAn0lEQVQoz32S2xaEIAhFlRQi7Tbz//86BrScaNV+9AiHWzASRGxESOGfLK9KzP19wAtDMAAd4P67mIydiSYUDh/xrSQwM9F6VNDqxMZS5quASZ2ZXCoEzVQqOmJAi/AENI/R2OopCHU7hbksJniIVYheqOUr5uCatgjQBlci/jA1dvNIOpJ9HLkwCVXasCFaqk5+Gvv7ou6rfT2Gx/P5ASKRDBsvqrF0AAAAAElFTkSuQmCC",
  2: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAPFBMVEUAAAD0T0f0T0f0T0f0T0f0T0f0T0f////6p6P81NL3e3X6sq/2cGr1WlP+6un+6ej909H7vbr5nJj3hoE+ZvPtAAAABnRSTlMA4KCQUEA6bX1/AAAAnUlEQVQoz4WSWxbDIAhEwaBgY97732sLrR5am+T+ECQyDgofKGB6gYHAEzE1MEJjSF8MdT2kH4L/v98Ta1ZyLvVbdZquMEs7AQClrqCQU57WdXL6zoGIcwMWxqzMs4XRlt4FfijbZoF9wbe6K6BKsPYty1JagnZcZq4+ahKA/hfIRrLLoQZF1OAhu3ayIfbEs7FfX1R/tZeP4fT5PAEDJgwFNA0cCQAAAABJRU5ErkJggg==",
  3: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAOVBMVEUAAACSafeSafeSafeSafeSafeSaffJtPv///+1mfrk2v2tj/mnhfn59v/Cq/vr4/7d0f2ZcvjWx/zL05hvAAAABnRSTlMA4KCQUEA6bX1/AAAAqElEQVQoz62S2xKDIAxEBXUl3Lz8/8c2blrGltGnnmEcISS7BIY3k3dQnJ+GK7NDw81DY8QX42fd4wd/3d/nzPxdKkpOG7bE6alD3SM0DjpQn1DSikZgzmTKEiEZKSFnBKG+VSqCuGCxUayWpaMFOFH+GXAMXMTFxM1uDaddER3Nrh0w9AdkrX3dNBpjBmJkJTaREe1SrfopO5t41/bni+qv9vEx3D6fF3YwDF2eJgJnAAAAAElFTkSuQmCC",
  4: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAaVBMVEX////ttXHmnD/klC7klC7llzXnoEjlljLgn1HbrnnklCzzypzvvYH55Mv338L00anllzP////66tfrrWTlmzvlmTbklC799+/23L33273xx5XxxI/uuXrmnkH67d301K7zzaPssm/noEa7DCoAAAAACnRSTlMUOYz58LlyyPDnVhjqGQAAALlJREFUKM99UtkSgyAM5FJaBARvq/b6/4/sBUlmarsvLNlkMtmEJXChlTFKC84oeGEABZFKaQhkmeMih6rl84qUD7l1lci7hstvQb76YF8UTPEswHi4XEPmHDrfm3COscmCYDqxoVkMgWYq09vYE0Ex5O5ES4jQjh0V1H6JYgf8VDVtftwXBAwYrPXO2pAHBEu2yTvnpw0sARP72fu5BxPR9mG1dh3QdlxUG2OLi6Kr7TpY7Z9j+Hk+D6Q2E6WiuM6qAAAAAElFTkSuQmCC",
  6: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAKlBMVEUAAABJulFJulFJulFJulFJulFJulH///+k3ah3y3275b5rx3JUvlzd8t9drIOSAAAABnRSTlMA4KCQUEA6bX1/AAAAg0lEQVQY02MAAhbFtDQhBwYwYBVLA4LEADDHLA0MkkFspjQoUIBKZG+DSLGCBDPaQGQAAyOCI8DgBiRPzlo5B0ilMKilpeVcLy+vPZaWlsQAtCSzLC0tfRrQKoY0BCcNyNnRBeKs6MbkIJShGIBiNIqlKM5BcSiyF9A8h/A2ZoAgggoAO4Vi8/VsG/oAAAAASUVORK5CYII=",
  5: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAMFBMVEUAAAA6k/w6k/w6k/w6k/w6k/w6k/ydyf5rrv3O5P7n8v/b6/7a6/621/5fp/1TofwkE3cBAAAABnRSTlMA4KCQUEA6bX1/AAAAfElEQVQY02MAAhbFtDQhBwYwYBVLA4LEADDHLA0MkkFspjQoUIBIwKVY0+AggIERwRFgcENwUhjU0tLyOoDgW1paEgPQksydM2fOKgNaxZAG5LSlpaWXARlATnkNiHO9HJODUIZiAIrRKJaiOAfFocheQPMcwtuYAYIIKgDsLmDR39pxGgAAAABJRU5ErkJggg=="
}
const types = { 1: "馈线段", 2: "母线", 3: "变压器", 4: "刀闸", 5: "开关", 6: "联络开关" }
const options = {
  tooltip: {
    trigger: "item",
    triggerOn: "mousemove",
    formatter ({ data: { name = "", type = 1 } }) {
      return types[type] + "：" + name
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
      const type = data.newType || data.TYPE || data.type || "emptyCircle"
      return symbolTypes[type] || symbolTypes[type] || "emptyCircle"
    },
    symbolSize: 24,
    initialTreeDepth: -1,
    expandAndCollapse: false,
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
    animationDurationUpdate: 750
  }
}
let myCharts = null

const isDiffObject = (old, newArr) => {
  return JSON.stringify(old) !== JSON.stringify(newArr)
}

const findSameNodes = (id, arr) => {
  arr.forEach((node, idx) => {
    node.newType = null
    if (node.id === id) {
      console.log("相同的id：", node)
      node.newType = 20
    }
    if (node.children && node.children.length) {
      findSameNodes(id, node.children)
    }
  })
}

export default props => {
  const refCharts = useRef()
  const [list, setList] = useState([])
  const data = props.data

  useEffect(() => {
    // console.log("useEffect:", data)
    if (isDiffObject(list, data)) {
      setList(data)
      if (myCharts) myCharts.clear()
    }
    options.series.data = data
    if (!myCharts) myCharts = echarts.init(refCharts.current)
    myCharts.setOption({ ...options })
    myCharts.on("click", function (params) {
      console.log(data)
      data[0].type = 2
      options.series.data = data
      console.log(params)
      const currentNodeId = params.data.id
      findSameNodes(currentNodeId, data)
      myCharts.setOption({ ...options })
      myCharts.resize()
    })
    window.addEventListener("resize", myCharts.resize)
    return () => { // 返回函数相当于 componentWillUnmount
      myCharts.off("click")
      myCharts = null
    }
  }, [data, list])
  return (<div className="echarts" ref={refCharts} style={{ height: "100%" }} />)
}