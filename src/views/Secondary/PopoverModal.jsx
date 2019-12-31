/* eslint-disable array-callback-return */
import React from "react"
import { Icon, Divider, Typography } from "antd"
import DlHorizontal from "@/components/DlHorizontal"
import "./popover.scss"
const { Text } = Typography
export default props => {
  // console.log("查找断开的开关", props)
  const { results = [], errors = [], devicesName = [] } = props
  return (
    <div className="pop-analysis" style={{ width: results.length > 3 ? 640 : 380 }}>
      <Icon type="close" className="pop-close" onClick={props.onClose} />
      <div>
        操作员断开了:{" "}
        {devicesName.map((device, idx) => {
          return idx > 0 ? <span key={idx}>、{device.name}</span> : device.name
        })}
      </div>
      {(results.length &&
        results.map((res, idx) => {
          return (
            <div key={idx}>
              {/* <DlHorizontal title="停电模拟操作" width="120px">断开了 {props.deviceName} 开关</DlHorizontal>
              <Divider style={{ marginTop: 0, marginBottom: 16 }} /> */}
              <p>转供分析建议：</p>
              <DlHorizontal title="分闸">
                {res.off && res.off.length
                  ? res.off.map((off, index) => {
                      return (
                        <span key={off}>
                          {index > 0 ? <Text type="secondary">&ensp;/&ensp;</Text> : null}
                          {off}
                        </span>
                      )
                    })
                  : null}
              </DlHorizontal>
              <DlHorizontal title="合闸">
                {res.on && res.on.length
                  ? res.on.map((on, index) => {
                      return (
                        <span key={on}>
                          {index > 0 ? <Text type="secondary">&ensp;/&ensp;</Text> : null}
                          {on}
                        </span>
                      )
                    })
                  : null}
              </DlHorizontal>
              <p>转供线路：</p>
              {res.lines && res.lines.length
                ? res.lines.map(line => {
                    return (
                      <div key={line.name}>
                        <Text type="secondary">线路名称：</Text>
                        {line.name} <Divider type="vertical" /> <Text type="secondary">转供负载：</Text>
                        {line.cap.toFixed(2)}KVA
                      </div>
                    )
                  })
                : null}
            </div>
          )
        })) ||
        null}
      {errors.length
        ? errors.map((err, idx) => {
            return idx > 0 ? (
              <span key={idx}>
                、<Text type="warning">{err.errorMsg}</Text>
              </span>
            ) : (
              <Text type="warning" key={idx}>
                {err.errorMsg}
              </Text>
            )
          })
        : null}
    </div>
  )
}
