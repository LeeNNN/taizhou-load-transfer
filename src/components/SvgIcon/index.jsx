import React, { useState } from "react"
import "./index.scss"

export default props => {
  const [iconName] = useState("#icon-" + props.icon)
  const [svgClass] = useState(`svg-icon ${ props.className ? props.className : "" }`)

  return (
    <svg
      {...props}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
      aria-hidden="true"
    >
      <use xlinkHref={iconName} />
    </svg>
  )
}