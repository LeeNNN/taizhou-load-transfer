import React from "react"
import { Spin } from "antd"

export default props => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0, 0.4)",
        zIndex: 1200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Spin />
    </div>
  )
}
