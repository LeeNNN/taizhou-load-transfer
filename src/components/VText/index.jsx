import React from "react"
import PropTypes from "prop-types"
import "./index.scss"

const VText = props => {
  const { children } = props
  return <span className="v-text">{children}</span>
}

VText.propTypes = {
  children: PropTypes.node
}

export default VText
