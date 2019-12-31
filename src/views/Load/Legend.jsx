import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Avatar } from "antd"
import VText from "../../components/VText"
import { symbolTypes, nameTypes, symbolSimpleTypes } from "../../utils/constant"
import "./legend.scss"

const Legend = props => {
  const { type, children } = props
  const [types, setTypes] = useState(symbolTypes)

  const [legend, setLegend] = useState(nameTypes)

  useEffect(() => {
    if (type) setTypes(symbolSimpleTypes)
  }, [type])

  useEffect(() => {
    if (type) setLegend({ 4: "刀闸", 5: "开关" })
  }, [type])

  return (
    <div className="legend">
      {children}
      {type
        ? Object.keys(legend).map(item => {
            return (
              <VText key={item} className="v-legend">
                <Avatar src={types[item][1].slice(8)} size={24} />
                <strong className="legend-desc">{nameTypes[item]}</strong>
              </VText>
            )
          })
        : Object.keys(legend).map(item => {
            return (
              <VText key={item} className="v-legend">
                <Avatar src={types[item].slice(8)} size={24} />
                <strong className="legend-desc">{nameTypes[item]}</strong>
              </VText>
            )
          })}
      <VText className="v-legend">
        <Avatar src={types[21].slice(8)} size={24} />
        <strong className="legend-desc">橙色背景为环状重复设备</strong>
      </VText>
      <VText className="v-legend">
        <Avatar src={types[61].slice(8)} size={24} />
        <strong className="legend-desc">虚线边框为外部馈线设备</strong>
      </VText>
    </div>
  )
}

Legend.propTypes = {
  type: PropTypes.string
}

export default Legend
