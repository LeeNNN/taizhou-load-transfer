import React, { useEffect, useState, useRef } from "react"
import svgPanZoom from "svg-pan-zoom"

export default props => {
  // eslint-disable-next-line no-unused-vars
  let refSvg = useRef(null)
  const { svgHtml } = props
  const [innerSvgHtml, setSvgHtml] = useState(null)
  useEffect(() => {
    setSvgHtml(svgHtml)
    let timer = setTimeout(() => {
      const svgDom = document.querySelector("#refSvg").children[0]
      if (svgDom) {
        console.log(svgDom)
        // / 读取出来的svg文件背景色为黑色 监听svg路径变化的话，等待dom渲染之后 修改其背景色
        let svgRect = svgDom.querySelector("#BackGround_Layer")
        if (svgRect) svgRect.children[0].style.fill = "none"
        svgPanZoom(svgDom, {
          zoomEnabled: true,
          controlIconsEnabled: false,
          fit: true,
          center: true,
          minZoom: 0.5,
          maxZoom: 100
        }).disableDblClickZoom()
      }
    }, 0)
    return () => {
      clearTimeout(timer)
      timer = null
    }
  }, [svgHtml])
  return (
    <div id="refSvg" ref={refSvg} dangerouslySetInnerHTML={{ __html: innerSvgHtml }} />
  )
}