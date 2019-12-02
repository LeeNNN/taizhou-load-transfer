import React, { useState } from "react"
import { Layout } from "antd"
import NavMenu from "./Navs"
import SvgIcon from "@/components/SvgIcon"
import "./index.scss"
const { Header } = Layout

export default props => {
  const [username] = useState("管理员")
  return (
    <Header className="top">
      <h3>泰州负荷转供</h3>
      <NavMenu />
      <div className="logout">
        <p>你好，{username}</p>
        <SvgIcon icon="logout" className="logout" onClick={() => { props.onLogout() }} />
      </div>
    </Header>
  )
}