import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { withRouter } from "react-router"
import Login from "./views/Login"
import Layouts from "./views/Layouts"
import { ConfigProvider } from "antd"
import zhCN from "antd/es/locale/zh_CN"
import "./App.scss"

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/" component={Layouts} />
        </Switch>
      </div>
    </ConfigProvider>
  )
}

export default withRouter(App)
