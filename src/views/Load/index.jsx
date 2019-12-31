import React, { Component, createRef } from "react"
import { Spin, Button, message } from "antd"
import Container from "@/components/Container"
import VTabs from "@/components/VTabs"
import Legend from "./Legend"
import EchartsLoad from "./GraphicLoad"
import TopoSimple from "./GraphicTopoSimple"
// import PopoverModal from "../Secondary/PopoverModal"
import DrawerAnalysis from "../ConfessionAnalysis/Drawer"
import DrawerAnalysisAll from "../ConfessionAnalysis/DrawerAll"
// import ModalPopoverAnalysis from "../ConfessionAnalysis"
import { getTopologyTree } from "@/api/common"
import { confessionAnalysis } from "@/api/svg"
import { source } from "@/utils/request"
import "./load.scss"

let topologyData = {}

export default class Load extends Component {
  state = {
    loading: false,
    topo: [],
    simpleTopo: [],
    lineId: null,
    depth: 1,
    depthSimple: 1,
    analysis: { errors: [], results: [] },
    deviceIds: [],
    visible: false,
    visibleAll: false
  }

  containerRef = createRef()
  minHeight = 0

  getTopoData = lineId => {
    message.destroy()
    this.setState({ loading: true })
    getTopologyTree(lineId)
      .then(res => {
        // const { topo = {}, simpleTopo = {} } = res
        topologyData = res
        this.handleTopoData()
      })
      .catch(_err => {
        this.setState({ topo: [], loading: false })
      })
  }

  // 处理成简图或者详图的数据
  handleTopoData = () => {
    this.setState({ loading: false })
    // console.log("topologyData:", topologyData)
    let simpleTopo = topologyData.simpleTopo.topology
      ? [{ ...topologyData.simpleTopo.topology, start: true }]
      : []
    const topo = topologyData.topo.topology ? [{ ...topologyData.topo.topology, start: true }] : []
    const depth = topologyData.topo.transverse || 1
    const depthSimple = topologyData.simpleTopo.transverse || 1
    this.setState({
      depth: depth > 1 ? depth - 1 : 1,
      depthSimple: depthSimple > 1 ? depthSimple - 1 : 1,
      topo,
      simpleTopo
    })
  }

  handleLoading = () => {
    this.setState({ loading: false })
  }

  handleTabChange = tab => {
    // console.log(tab)
    this.setState({ visible: false })
    // this.handleTopoData(tab)
  }

  handleVisibleChange = visible => {
    const { lineId = null, deviceIds = [] } = this.state
    if (deviceIds.length === 0) return
    if (visible) {
      this.setState({ loading: true })
      confessionAnalysis(lineId, deviceIds)
        .then(res => {
          if (res && res.length) {
            // console.log("转供分析：", res)
            const errors = res.filter(err => err.errorMsg)
            const results = res
              .filter(err => !err.errorMsg)
              .map(item => {
                const { analyse = [] } = item
                if (analyse.length) {
                  return analyse.reduce(
                    (accu, curr) => {
                      accu.on.push(curr.switchOnCbLine + "-" + curr.switchOnCbName)
                      curr.switchOutName && accu.off.push(curr.switchOutName)
                      accu.lines.push({ name: curr.lineName, cap: +curr.lineCap })
                      return accu
                    },
                    { on: [], off: [], lines: [] }
                  )
                }
                return null
              })
            this.setState({ analysis: { errors, results }, visible })
          } else {
            // 转供分析失败
            message.error(res.resultMsg)
            this.setState({ loading: false })
            // todo 是否调用重置事件
            this.handleReset()
          }
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    } else {
      this.setState({ analysis: { on: [], off: [], lines: [] }, visible })
    }
  }

  handleCurrentNode = nodes => {
    // console.log("在父节点当中", nodes)
    this.setState({ deviceIds: nodes })
  }

  // 区间转供分析
  handleAnalysis = () => {
    this.setState({ visible: true })
  }

  // 整体转供分析
  handleAnalysisAll = () => {
    this.setState({ visibleAll: true })
  }

  handleDrawerClose = () => {
    this.setState({ visible: false, visibleAll: false })
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

  componentWillUnmount() {
    source.cancel()
  }

  render() {
    const { topo, depth, depthSimple, simpleTopo, lineId, deviceIds, visible, loading, visibleAll } = this.state
    const disabled = !deviceIds.length
    return (
      <Spin spinning={this.state.loading} delay={50}>
        <Container style={{ overflow: topo.length ? "auto" : "hidden", width: "100%" }}>
          {topo.length === 0 ? (
            <div className="no-data" ref={node => (this.containerRef = node)} />
          ) : (
            <div style={{ background: "#172341", width: "100%" }}>
              <VTabs type="card" onChange={this.handleTabChange}>
                <div label="简图" key="simpleTopo" icon="topoSimple" className="v-tab-pane">
                  <Legend type="simple">
                    <Button
                      className="btn-height"
                      type="success"
                      loading={loading}
                      onClick={this.handleAnalysisAll}
                      style={{ marginRight: 20 }}
                    >
                      整体转供分析
                    </Button>
                    <Button
                      className="btn-height"
                      type="success"
                      loading={loading}
                      disabled={disabled}
                      onClick={this.handleAnalysis}
                      style={{ marginRight: 20 }}
                    >
                      区间转供分析
                    </Button>
                  </Legend>
                  <TopoSimple
                    data={simpleTopo}
                    handleCurrentNode={this.handleCurrentNode}
                    depth={depthSimple}
                  />
                </div>
                <div label="详图" key="topo" icon="topo" className="v-tab-pane">
                  <Legend />
                  <EchartsLoad data={topo} depth={depth} handleLoading={this.handleLoading} />
                </div>
              </VTabs>
              {/* <Legend />
              <VTabs
                defaultActiveKey={activeTab}
                tabs={[
                  { label: "简图", key: "simpleTopo" },
                  { label: "详图", key: "topo" }
                ]}
                onChange={this.handleTabChange}
              />
              <EchartsLoad data={topo} depth={depth} handleLoading={this.handleLoading} type={activeTab} /> */}
            </div>
          )}

          <DrawerAnalysis visible={visible} onDrawClose={this.handleDrawerClose} />
          <DrawerAnalysisAll visible={visibleAll} onDrawClose={this.handleDrawerClose} lineId={lineId} />
        </Container>
      </Spin>
    )
  }
}
