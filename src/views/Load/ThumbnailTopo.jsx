import React, { useState, useRef,useEffect } from "react"
import * as d3 from "d3"
import { svgModel } from "@/utils/constant"
import "./load.scss"

let svg = null, currentTransform = null
const boxWidth = 30, boxHeight =30

const setUpZoom1 = function() {
  // const { currentTransform, svg } = this
  return setUpZoom({ currentTransform }, () => {
    d3.select(".tsvg").select("g").attr("transform", d3.event.transform)
  })
}
function setUpZoom ({ currentTransform }, zoomCallBack) {
  const zoom = d3.zoom().scaleExtent([0.3, 10])
  zoom.on("zoom", onZoom(zoomCallBack))
  svg.call(zoom).on("wheel", () => d3.event.preventDefault())
  svg.call(zoom.transform, currentTransform || d3.zoomIdentity)
  return zoom
}

function onZoom (zoomCallBack) {
  return () => {
    const transform = d3.event.transform
    zoomCallBack && zoomCallBack({ transform })
  }
}

export default props => {
  const refCharts = useRef()
  const {topology, transverse, vertical, margin} = props
  const [cTopology, setCTopology] = useState([])


  svg = d3.select(".tsvg")
  setUpZoom1()
  useEffect(() => {
    if(!topology)return
    setCTopology(topology)
    // const that = this
    d3.selectAll("g").remove()
      var marge = { top: 50, bottom: 0, left: 10, right: 0 }
      var g = svg.append("g")
        .attr("transform", "translate(" + marge.top + "," + marge.left + ")")
      // 创建一个hierarchy layout
      // console.log("topology", topology)
      var hierarchyData = d3.hierarchy(topology)
        .sum(function (d) {
          return d.value
        })
      // 创建一个树状图
      
      var tree = d3.tree()
        .size([vertical * 340 + 300, transverse*300+100])
        .separation(function (a, b) {
          return (a.parent === b.parent ? 1 : 2) / a.depth
        })
      // 初始化树状图，也就是传入数据,并得到绘制树基本数据
      var treeData = tree(hierarchyData)
      // console.log(treeData)
      // 得到节点
      var nodes = treeData.descendants()
      var links = treeData.links()

      // 输出节点和边
      // const combinedObj = {}
      // nodes.forEach((element, index) => {
      //   // console.log(element, element.combinedId)
      //   if (element.data.combinedId) {
      //     const arr = combinedObj[element.data.combinedId] || []
      //     arr.push(element)
      //     combinedObj[element.data.combinedId] = arr
      //   }
      // })

      // 单条母线
      // console.log("combinedObj",combinedObj)
      // const muxianObj = {}
      // Object.keys(combinedObj).forEach(key => {
      //   let muxian = combinedObj[key].filter(item=> +item.data.type===2)
      //   muxian = muxian.length > 0?muxian[0]:null
      //   muxian&&(muxianObj[key] = {
      //     parentId: muxian.data.parentId,
      //     id: muxian.data.id
      //   })
      // })
      // Object.keys(combinedObj).forEach(key => {
      //   const muxian = muxianObj[key]
      //   if (muxian) {
      //     const list  = combinedObj[key].filter(item => {
      //       return item.data.id===muxian.id||item.data.id===muxian.parentId||item.data.parentId === muxian.id
      //     })
      //     combinedObj[key] = list
      //   }
      // })
      // console.log("combinedObj",combinedObj)

      // 多条母线 去除未连接母线的开关
      // console.log("combinedObj",combinedObj)
      // const muxianObj = {}
      // Object.keys(combinedObj).forEach(key => {
      //   let muxian = combinedObj[key].filter(item=> +item.data.type===2)||[]
      //   muxianObj[key] = muxian.map(el => {
      //     return {
      //       parentId: el.data.parentId,
      //       id: el.data.id
      //     }
      //   })||[]
      // })
      // Object.keys(combinedObj).forEach(key => {
      //   const muxian = muxianObj[key]
      //   if (muxian&&muxian.length>0) {
      //     const list  = combinedObj[key].filter(item => {
      //       const {id, parentId} = item.data
      //       let exist = false
      //       muxian.forEach(el => {
      //         if (!exist) {
      //           exist = id===el.id||id===el.parentId||parentId === el.id
      //         }
      //       })
      //       return exist
      //     })
      //     combinedObj[key] = list
      //   } else {
      //     delete combinedObj[key]
      //   }
      // })
      // console.log("combinedObj",combinedObj)

      // const huanwang = []
      // for (const key in combinedObj) {
      //   // eslint-disable-next-line no-prototype-builtins
      //   if (combinedObj.hasOwnProperty(key)) {
      //     const obj = { x: Infinity, y: Infinity, width: 0, height: 0 }
      //     const element = combinedObj[key]
      //     element.forEach(el => {
      //       obj.id = el.data.combinedId
      //       obj.name = el.data.combinedName
      //       obj.x = Math.min(obj.x, el.x)
      //       obj.y = Math.min(obj.y, el.y)
      //       obj.width = Math.abs(obj.x - el.x) + boxWidth
      //       obj.height = Math.abs(obj.y - el.y) + boxHeight
      //     })
      //     huanwang.push(obj)
      //   }
      // }
      // console.log('huanwang', huanwang)

      // combinedId 对应的环网柜
      const combinedObj = {}
      nodes.forEach((element, index) => {
        // console.log(element, element.combinedId)
        const {combinedId, combinedName} = element.data
        if (combinedId) {
          // console.log("combinedId",element.data)
          /// 分支箱不显示
          if (!(combinedName.indexOf("分支箱") > -1)) {
            const arr = combinedObj[combinedId] || []
            arr.push(element)
            combinedObj[combinedId] = arr
          }
        }
      })
      // combinedId 对应拆分后的环网柜
      const combinedObjH = {}
      for (const key in combinedObj) {
        // eslint-disable-next-line no-prototype-builtins
        if (combinedObj.hasOwnProperty(key)) {
          const element = combinedObj[key]
          const muxians = element.filter(el => +el.data.type === 2)
          const existArr = []
          const arr = combinedObjH[key] || []
          muxians.forEach(el => {
            // const ids = [el.parentId, el.id]
            const harr = []
            if (!existArr.includes(el)) {
              for (let index = 0; index < element.length; index++) {
                const el1 = element[index]
                if (el1 === el || el1.children.includes(el) || el.children.includes(el1)) {
                  existArr.push(el1)
                  harr.push(el1)
                }
              }
            }
            harr && harr.length > 0 && arr.push(harr)
          })
          for (let index = 0; index < element.length; index++) {
            const el2 = element[index]
            if (!existArr.includes(el2)) {
              arr.push([el2])
            }
          }
          combinedObjH[key] = arr
        }
      }
      console.log("combinedObj", combinedObj, combinedObjH)
      const huanwang = []
      for (const key in combinedObjH) {
        // eslint-disable-next-line no-prototype-builtins
        if (combinedObjH.hasOwnProperty(key)) {
          const element = combinedObjH[key]
          element.forEach(el1 => {
            const obj = { x: Infinity, y: Infinity, width: 0, height: 0 }
            el1.forEach(el => {
              obj.id = el.data.combinedId
              obj.name = el.data.combinedName
              obj.x = Math.min(obj.x, el.x)
              obj.y = Math.min(obj.y, el.y)
              // const { width = 12, height = 12 } = {}// svgModel[el.type]
              // 应该取得最大的x y对应图元的width height
              obj.width = Math.abs(obj.x - el.x) + boxWidth
              obj.height = Math.abs(obj.y - el.y) + boxHeight
            })
            huanwang.push(obj)
          })
        }
      }

      huanwang.forEach(el => {
        g.append("rect")
          .attr("stroke-width", 0.8)
          .attr("stroke", "white")
          .attr("fill", "rgba(0,0,0,0)")
          .attr("width", el.height + boxHeight)
          .attr("height", el.width + boxWidth - 5)
          .attr("x", el.y - boxHeight)
          .attr("y", el.x - boxWidth + 5)
        g.append("text")
          .attr("x", el.y)
          .attr("y", el.x - boxWidth)
          // .data(el)
          .attr("font-size", "8px")
          .text(el.name)
          .attr("fill", "white")
      })
      // 绘制边
      g.append("g")
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", function (d) {
          let width = boxWidth / 2
          if (+d.source.data.type === 2 ||
          +d.target.data.type === 2) {
            width = 1
            // height = 300
          }
          const sourceY = d.source.x
          const sourceX = d.source.y + width
          const targetY = d.target.x
          const targetX = d.target.y - width
          // 水平布局
          return "M" + sourceX + "," + sourceY +
                    "H" + ((targetX - sourceX) / 2 + sourceX) +
                    "V" + targetY +
                    "H" + targetX
        })
        .attr("stroke-dasharray", function (d) {
          if (d.target.data.isOutsideDevice) {
            return "10 2"
          }
          return "0 0"
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 0.6)

      // 绘制节点和文字
      // 老规矩，先创建用以绘制每个节点和对应文字的分组<g>
      var gs = g.append("g")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          var cx = d.x
          var cy = d.y
          return "translate(" + cy + "," + cx + ")"
        })
      // 绘制节点
      gs.append("use")
        .attr("xlink:href", function (d) {
          // console.log('xlink', d.data.type, d.data.point)
          const typeModel = svgModel[d.data.type]
          if (typeModel) {
            return typeModel.svgName(d.data.point)
          }
          return "#eleme"
        })
        .attr("y", (d) => {
          if (+d.data.type === 2) {
            // return -150
            return -15
          }
          return d.depth !== 2 ? -(boxWidth / 2) : -(boxHeight / 2)
        })
        .attr("x", (d) => {
          if (+d.data.type === 2) {
            return -1
          }
          return d.depth !== 2 ? -(boxWidth / 2) : -(boxHeight / 2)
        })
        .attr("width", (d) => {
          if (+d.data.type === 2) {
            return 2
          }
          return boxWidth
        })
        .attr("height", (d) => {
          if (+d.data.type === 2) {
            return 30
          }
          return boxHeight
        })
      // 文字
      gs.append("text")
        .attr("x", function (d) {
          if (+d.data.type === 2) {
            return 10
          }
          return d.children ? -20 : boxWidth / 2
        })
        .attr("y", -5)
        .attr("dy", function (d) {
          if (+d.data.type === 2) {
            return -10
          } if (+d.data.type === 0) {
            return -13
          }
          return d.children ? -5 : 10
        })
        .attr("font-size", function (d) {
          return d.children ? "8px" : "8px"
        })
        // 竖向布局文字
        .attr("style", function (d) {
          if (+d.data.type === 2) {
            return "writing-mode: tb;letter-spacing:0px;"
          }
          return ""
        })
        .attr("fill", "white")
        .text(function (d) {
          if (+d.data.type === 2) {
            return ""
          }
           else if (+d.data.type === 4||+d.data.type === 5) {
            const name = d.data.name.replace(/([(开关)|(刀闸)|(闸刀)].*)/g, "")
            return name
          }
          return d.data.name
        })
  }, [topology, cTopology, transverse, vertical, margin])

  return (
    <div ref={refCharts} style={{ height: "calc(100% - 40px)", width: "calc(100%)", background: "black" }} >
      <svg className="tsvg" width="100%" height="100%" />
    </div>
  )
}
