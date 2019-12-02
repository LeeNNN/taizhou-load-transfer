import React from "react"
import "./index.scss"

export default props => {
  const { title, children } = props
  return (
    <dl className="dl-horizontal">
      <dt>{title}:</dt>
      <dd>
        {children}
      </dd>
    </dl>
  )
}