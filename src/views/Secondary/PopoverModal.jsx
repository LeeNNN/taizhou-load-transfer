import React from "react"
import { Icon, Divider, Typography } from "antd"
import DlHorizontal from "@/components/DlHorizontal"
import "./popover.scss"
const { Text } = Typography
export default props => {
  const { analysis = {} } = props
  return (
    <div className="pop-analysis" style={{ width: analysis.off.length > 3 ? 640 : 380 }}>
      <Icon type="close" className="pop-close" onClick={props.onClose} />
      <DlHorizontal title="停电模拟操作" width="120px">断开了 {props.deviceName} 开关</DlHorizontal>
      <Divider style={{ marginTop: 0, marginBottom: 16 }} />
      <p>转供分析建议：</p>
      <DlHorizontal title="分闸">
        {analysis.off.map((off, index) => {
          return (
            <span key={off}>{index > 0 ? <Text type="secondary">&ensp;/&ensp;</Text> : null}{off}</span>
          )
        })}
      </DlHorizontal>
      <DlHorizontal title="合闸">
        {analysis.on.map((on, index) => {
          return (
            <span key={on}>{index > 0 ? <Text type="secondary">&ensp;/&ensp;</Text> : null}{on}</span>
          )
        })}
      </DlHorizontal>
      <p>转供线路：</p>
      {
        analysis.lines.map(line => {
          return (
            <div key={line.name}><Text type="secondary">线路名称：</Text>{line.name} <Divider type="vertical" /> <Text type="secondary">转供负载：</Text>{line.cap.toFixed(2)}MVA</div>
          )
        })
      }
    </div>
  )
}