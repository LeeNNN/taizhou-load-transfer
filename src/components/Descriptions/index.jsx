import React from "react"
import PropTypes from "prop-types"
import "./index.scss"

const DescriptionsCustom = props => {
  const { list } = props
  return (
    <div className="descriptions">
      {list.map(dl => {
        return (
          <dl key={dl.name} className="desc-item">
            <dt>{dl.name}</dt>
            <dd>{dl.value}</dd>
          </dl>
        )
      })}
    </div>
  )
}

DescriptionsCustom.propTypes = {
  list: PropTypes.array
}

export default DescriptionsCustom
