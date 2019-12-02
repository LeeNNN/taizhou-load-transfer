import React from "react"
import { Icon } from "antd"
import DlHorizontal from "@/components/DlHorizontal"
import "./popover.scss"

export default props => {
  return (
    <div className="pop-analysis">
      <Icon type="close" className="pop-close" onClick={props.onClose} />
      <DlHorizontal title="合&emsp;&emsp;闸">开关名称开关名称开关名称开关名称开关名称开关名称开关名称</DlHorizontal>
      <DlHorizontal title="分&emsp;&emsp;闸">开关名称开关名称开关名名称</DlHorizontal>
      <DlHorizontal title="转供结果">开关名称</DlHorizontal>
      <DlHorizontal title="线&ensp;路&ensp;1">开关名称开关名称开关名称开关名称开关名称开关名称开关名称</DlHorizontal>
      <DlHorizontal title="线&ensp;路&ensp;2">开关名称开关名称开关名称开关名称开关名称开关名称开关名称</DlHorizontal>
    </div>
  )
}