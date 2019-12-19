import React from "react"
import { Avatar } from "antd"
import VText from "../../components/VText"
import { symbolTypes, nameTypes } from "../../utils/constant"
import "./legend.scss"

const Legend = props => {
  return (
    <div className="legend">
      {Object.keys(nameTypes).map(item => {
        return (
          <VText key={item}>
            <Avatar src={symbolTypes[item].slice(8)} size={24} />
            <strong className="legend-desc">{nameTypes[item]}</strong>
          </VText>
        )
      })}

      <VText>
        <Avatar src={symbolTypes[21].slice(8)} size={24} />
        <strong className="legend-desc">橙色背景为对应类型的重复设备</strong>
      </VText>
      <VText>
        <Avatar src={symbolTypes[61].slice(8)} size={24} />
        <strong className="legend-desc">虚线边框为对应类型的外部设备</strong>
      </VText>
    </div>
  )
}

export default Legend
