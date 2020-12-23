import React, { Component, useState, useRef,useEffect } from "react"
import "./topo-simple.scss"
import Draw from "./utils/draw"
import $ from "jquery"
import WheelEvent from "jquery-mousewheel"

var scales = 1
export default (props) => {
  const refCharts = useRef()
  const {topology, transverse, vertical} = props
  useEffect(() => {
      var option = {
        open_busbar_breaker_merge: true, //开启母线后开关合并
        render_combine: true,  //开启渲染环网
        open_combine_beautify: true,  //开启环网柜美化模式（绝对高宽比例）
        open_outside_feeder_render: false  //开启对端线路不同方式渲染
      }
      //初始化数据
      Draw.init($(".kdiv"), { topology, transverse, vertical }, option)
    //   //拖拽事件
    //   $(".kdiv").draggable({
    //     scroll: false
    //   }) //设置drag1只能在containment-wrapper中拖动
    //   //缩放事件
    //   // $(".kdiv").mousewheel(function (event) {
    //   //   handle(event.deltaY, event)
    //   // })
    // refCharts.addEventListener("mousewheel", WheelEvent, { passive: false })
  }, [topology, transverse, vertical])

  // handle = (delta, event) => {
  //   if (delta === -1 && scales < 0.2) {
  //     return
  //   }
  //   scales += delta / 3000
  //   $(document.body).css("-webkit-transform", "scale(" + scales + ")")
  //   event.preventDefault()
  //   event.stopPropagation()
  //   return
  // }
  return (
    <div style={{ height: "calc(100% - 40px)", width: "calc(100%)", background: "black", position: "relative" }}>
      <div ref={refCharts} className="kdiv"  />
    </div>
  )
}
