import React from "react"
import ReactDOM from "react-dom"
import { HashRouter as Router } from "react-router-dom"
import "./assets/scss/index.scss"
import "@/icons"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
if (process.env.NODE_ENV === "development" && process.env.REACT_APP_BASEURL === "mock") {
  require("./mock/index")
}
// basename="occa_analysis"
ReactDOM.render(<Router><App /></Router>, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
