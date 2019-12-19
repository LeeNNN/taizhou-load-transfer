import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { withRouter } from "react-router"
import Login from "./views/Login"
import Layouts from "./views/Layouts"
import "./App.scss"

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/" component={Layouts} />
      </Switch>
    </div>
  )
}

export default withRouter(App)
