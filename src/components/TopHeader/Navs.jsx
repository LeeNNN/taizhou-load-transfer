import React from "react"
import { NavLink } from "react-router-dom"
import "./navs.scss"

export default props => {
  return (
    <div className="navs">
      <NavLink to="/topology" activeClassName="active" className="nav">
        线路拓扑分析
      </NavLink>
      <NavLink to="/load" activeClassName="active" className="nav">
        负荷转供分析
      </NavLink>
    </div>
  )
}
