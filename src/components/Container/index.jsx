import React from "react"
import "./index.scss"
export default props => {
  return (
    <div className="container" style={props.style ? { ...props.style } : null}>
      {props.children}
    </div>
  )
}