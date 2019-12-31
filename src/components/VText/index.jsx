import React from "react"
import PropTypes from "prop-types"
import "./index.scss"

const VText = props => {
  const { children, type, className } = props
  return (
    <span className={`v-text ${className}`} type={type}>
      {children}
    </span>
  )
}

VText.propTypes = {
  children: PropTypes.node
}

export default VText
