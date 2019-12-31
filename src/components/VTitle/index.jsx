import React from "react"
import PropTypes from "prop-types"
import "./index.scss"

const VTitle = props => {
  const { level = 4, children, style } = props
  return (
    <>
      {level === 1 ? (
        <h1 className="v-title" style={style ? style : null}>
          {children}
        </h1>
      ) : level === 2 ? (
        <h2 className="v-title" style={style ? style : null}>
          {children}
        </h2>
      ) : level === 3 ? (
        <h3 className="v-title" style={style ? style : null}>
          {children}
        </h3>
      ) : level === 4 ? (
        <h4 className="v-title" style={style ? style : null}>
          {children}
        </h4>
      ) : level === 5 ? (
        <h5 className="v-title" style={style ? style : null}>
          {children}
        </h5>
      ) : level === 6 ? (
        <h6 className="v-title" style={style ? style : null}>
          {children}
        </h6>
      ) : (
        <h4 className="v-title" style={style ? style : null}>
          {children}
        </h4>
      )}
    </>
  )
}

VTitle.propTypes = {
  level: PropTypes.number,
  children: PropTypes.node,
  style: PropTypes.object
}

export default VTitle
