import React, { Component } from "react"
import { Spin } from "antd"
import Container from "@/components/Container"
import EchartsLoad from "./GraphicLoad"
import { getTopologyTree } from "@/api/common"
import "./load.scss"

export default class Load extends Component {
  state = {
    loading: false,
    list: [],
    lineId: null
  }

  getTopoData = lineId => {
    this.setState({ loading: true })

    getTopologyTree(lineId).then(res => {
      // console.log("=======", res)
      if (!res) {
        this.setState({ list: [] })
      } else {
        this.setState({ list: [...res] })
      }
    }).catch(_err => {
      this.setState({ list: [] })
    }).finally(() => { this.setState({ loading: false }) })
  }

  componentDidMount () {
    // this.getTopoData()
  }

  componentDidUpdate () {
    const { currentNode: { ID = "" } } = this.props
    if (ID && ID !== this.state.lineId) {
      this.setState({ lineId: ID })
      this.getTopoData(ID)
    }
  }

  render () {
    const { list } = this.state
    return (
      <Spin spinning={this.state.loading} delay={500}>
        <Container>
          <div style={{ flex: 1, background: "#172341", position: "relative" }}>
            <EchartsLoad data={list} />
            {list.length === 0 ? <div className="no-data" /> : null}
          </div>
        </Container>
      </Spin>
    )
  }
}
