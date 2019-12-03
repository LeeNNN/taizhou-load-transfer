import React from "react"
import "./index.scss"

export default props => {
  const { title, children, width } = props

  return (
    <dl className="dl-horizontal">
      <dt style={width ? { width } : null}>{title}:</dt>
      <dd>
        {children}
      </dd>
    </dl>
  )
}