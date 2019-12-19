import React, { Component, createRef } from "react"
import { Spin } from "antd"
import Container from "@/components/Container"
import VTabs from "../../components/VTabs"
import Legend from "./Legend"
import EchartsLoad from "./GraphicLoad"
import { getTopologyTree } from "@/api/common"
import "./load.scss"

let topologyData = {}

export default class Load extends Component {
  state = {
    loading: false,
    list: [],
    lineId: null,
    depth: 1,
    activeTab: "simpleTopo"
  }

  containerRef = createRef()
  minHeight = 0

  getTopoData = lineId => {
    const { activeTab } = this.state
    this.setState({ loading: true })
    getTopologyTree(lineId)
      .then(res => {
        const { topo = {}, simpleTopo = {} } = res
        console.log(topo, simpleTopo)
        topologyData = res
        this.handleTopoData(activeTab)
      })
      .catch(_err => {
        this.setState({ list: [], loading: false })
      })
  }

  // 处理成简图或者详图的数据
  handleTopoData = activeTab => {
    let { topology = {}, transverse = 0 } = topologyData[activeTab]
    topology = [topology]
    if (topology.length === 0) {
      this.setState({ list: [], loading: false })
    } else {
      this.setState({
        depth: transverse > 1 ? transverse - 1 : 1,
        list: [...topology]
      })
    }
  }

  handleLoading = () => {
    this.setState({ loading: false })
  }

  handleTabChange = tab => {
    console.log(tab)
    this.setState({ activeTab: tab })
    this.handleTopoData(tab)
  }

  componentDidMount() {
    this.minHeight = this.containerRef.clientHeight
    const {
      currentNode: { id = "" }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id })
      this.getTopoData(id)
    }
  }

  componentDidUpdate() {
    const {
      currentNode: { id = "" }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id })
      this.getTopoData(id)
    }
  }

  render() {
    const { list, depth, activeTab } = this.state
    return (
      <Spin spinning={this.state.loading} delay={50}>
        <Container style={{ overflow: list.length ? "auto" : "hidden" }}>
          {list.length === 0 ? (
            <div className="no-data" ref={node => (this.containerRef = node)} />
          ) : (
            <div style={{ flex: 1, background: "#172341" }}>
              <Legend />
              <VTabs
                defaultActiveKey={activeTab}
                tabs={[
                  { label: "简图", key: "simpleTopo" },
                  { label: "详图", key: "topo" }
                ]}
                onChange={this.handleTabChange}
              />
              <EchartsLoad data={list} depth={depth} handleLoading={this.handleLoading} type={activeTab} />
            </div>
          )}
        </Container>
      </Spin>
    )
  }
}
