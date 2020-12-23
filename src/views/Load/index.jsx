import React, { Component, createRef } from "react"
import { Spin, Button, message } from "antd"
import Container from "@/components/Container"
import VTabs from "@/components/VTabs"
import Legend from "./Legend"
import EchartsLoad from "./GraphicLoad"
// import TopoSimple from "./GraphicTopoSimple"
import ThumbnailTopo from "./ThumbnailTopo"
import TopoSimple from "./TopoSimple"
import DrawerAnalysis from "../ConfessionAnalysis/Drawer"
import DrawerAnalysisAll from "../ConfessionAnalysis/DrawerAll"
import { getTopologyTree, setLineInvalid } from "@/api/common"
import { confessionAnalysis } from "@/api/svg"
import { source } from "@/utils/request"
import "./load.scss"
// import LineInvalid from "@/components/LineInvalid"
import LineNoData from "@/components/LineNoData"
import IFrame from "react-iframe-comm"
// let topologyData = {}

export default class Load extends Component {
  state = {
    loading: false,
    topo: [], // 详图
    simpleTopo: [], // 简图
    simpleOriginTopo: {}, // 简图源数据
    lineId: null,
    lineName: "",
    lineInvalidReason: "",
    lineInvalid: false,
    resultCode: "1",
    visibleInvalid: false,
    depth: 1,
    depthSimple: 1,
    analysis: { errors: [], results: [] },
    deviceIds: [],
    visible: false,
    visibleAll: false
  }

  containerRef = createRef()
  minHeight = 0

  topoIdFun = (obj) => {
    const {id, name, combinedId, combinedName, children} =obj
    return {
      id,
      name,
      combinedId,
      combinedName,
      children: (children&&(children.map(el => {
        return this.topoIdFun(el)
      })))||[]
    }
  }

  getTopoData = lineId => {
    message.destroy()
    this.setState({ loading: true })

    // 获取简图
    getTopologyTree(lineId, "1")
      .then(res => {
        // console.log("简图：", res)
        const { topo } = res
        const { transverse = 1, topology } = topo
        // console.log(topology)
        // 简化数据
        // console.log(JSON.stringify(this.topoIdFun(topology)))
        const simpleTopo = [{ ...topology, start: true }]
        const depth = transverse > 1 ? transverse - 1 : 1
        this.setState({ depthSimple: depth, simpleTopo, loading: false, simpleOriginTopo: topo })
      })
      .catch(_err => {
        // console.log("简图err：", _err)
        // this.setState({ topo: [], loading: false })
        const {resultMsg, resultCode} = _err
        this.setState({ depthSimple: 0, simpleTopo: [], loading: false,lineInvalidReason: resultMsg, resultCode  })
      })

    // 获取详图
    getTopologyTree(lineId, "2")
      .then(res => {
        // console.log("详图：", res)
        const { topo } = res
        const { transverse = 1, topology } = topo

        const topoX = [{ ...topology, start: true }]
        const depth = transverse > 1 ? transverse - 1 : 1
        this.setState({ depth, topo: topoX })
      })
      .catch(_err => {
        const {resultMsg, resultCode} = _err
        this.setState({ topo: [], loading: false, lineInvalidReason: resultMsg, resultCode })
      })
  }

  handleLoading = () => {
    this.setState({ loading: false })
  }

  handleTabChange = tab => {
    this.setState({ visible: false })
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

  changeVisibleInvalid = () => {
    this.setState({
      visibleInvalid: true
    })
  }

  handleLineInvalidOk = () => {
    setLineInvalid(this.state.lineId).then(res => {
      // console.log("res", res)
      this.props.changeVisibleInvalid(true)
      this.setState({
        visibleInvalid: false,
        lineInvalid: true
      })
    }).catch(_err => {
      // console.log("_err", _err)
      const {resultMsg} = _err
      message.error(`设置无效报错原因: ${resultMsg}`)
    })
  }

  handleLineInvalidCancel = () => {
    this.setState({
      visibleInvalid: false
    })
  }

  componentDidMount() {
    this.minHeight = this.containerRef.clientHeight
    const {
      currentNode: { id = "", name = "", invalid=false }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id, lineName: name, lineInvalid: invalid, resultCode: invalid?"2":"0", simpleTopo: [] })
      if (!invalid) {
        this.getTopoData(id)
      }
    }
  }

  componentDidUpdate() {
    const {
      currentNode: { id = "", name = "",invalid=false  }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id, lineName: name, lineInvalid: invalid, resultCode: invalid?"2":"0", simpleTopo: []})
      if (!invalid) {
        this.getTopoData(id)
      }
    }
  }

  componentWillUnmount() {
    source.cancel()
  }


  
  render() {
    //depthSimple, deviceIds,
    const { topo, depth, simpleTopo, simpleOriginTopo, lineId, lineName, visible, loading, visibleAll, visibleInvalid, lineInvalidReason,resultCode, lineInvalid} = this.state
    // const disabled = !deviceIds.length
    let src = "/simple_draw/index.html"
    if (process.env.NODE_ENV === "production") {
      src = `${process.env.REACT_APP_HOST}/${process.env.REACT_APP_BASEURL}/simple_draw/index.html`
    }
    const attributes = {
      //http://localhost:28002/occa_analysis/simple_draw/index.html
      //src: process.env.NODE_ENV === "production" ? "http://localhost:28002/occa_analysis/simple_draw/index.html": "http://localhost:3000/simple_draw/index.html",
      src: src,
      width: "100%",
      height: "100%",
      frameBorder: 0,
    }
    const postMessageData = simpleOriginTopo
    const onReceiveMessage = () => {
      // console.log("onReceiveMessage")
    }
    const onReady = () => {
      // console.log("onReady")
    }

    const props = {
      visibleInvalid,
      lineName,
      lineInvalidReason,
      resultCode,
      lineInvalid,
      changeVisibleInvalid: this.changeVisibleInvalid,
      handleLineInvalidOk: this.handleLineInvalidOk,
      handleLineInvalidCancel: this.handleLineInvalidCancel,
    }
    return (
      <Spin spinning={this.state.loading} delay={50}>
        <Container style={{ overflow: topo.length ? "auto" : "hidden", width: "100%" }}>
          {simpleTopo.length === 0 ? (
            <LineNoData {...props}/>
            // <div className="no-data">
            //   <div ref={node => (this.containerRef = node)} >
            //   {+resultCode===2 ? lineInvalid ? <p>{`当前线路 ${lineName} 状态: 无效`}</p>:
            //     (<Button
            //       className="btn-height"
            //       type="success"
            //       onClick={this.changeVisibleInvalid}
            //       style={{ marginRight: 20 }}
            //     >设为无效</Button>)
            //     : ("")
            //   }
            //   </div>
            //     <LineInvalid //visible={visibleInvalid}
            //       {...props}
            //       handleOk={this.handleLineInvalidOk}
            //       handleCancel={this.handleLineInvalidCancel} />
            // </div>
          ) : (
            <div style={{ background: "#172341", width: "100%" }}>
              <VTabs type="card" onChange={this.handleTabChange}>
                <div label="简图" key="simpleTopo" icon="topoSimple" className="v-tab-pane">
                  <div>
                  <Button
                      className="btn-height"
                      type="success"
                      loading={loading}
                      onClick={this.handleAnalysisAll}
                      style={{ marginRight: 20 }}
                    >
                      整体转供分析
                    </Button>
                    {/* <Button
                      className="btn-height"
                      type="success"
                      loading={loading}
                      disabled={disabled}
                      onClick={this.handleAnalysis}
                      style={{ marginRight: 20 }}
                    >
                      区间转供分析
                    </Button> */}
                  </div>
                  {/* <Legend type="simple">
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
                  </Legend> */}
                  {/* <TopoSimple
                    data={simpleTopo}
                    handleCurrentNode={this.handleCurrentNode}
                    depth={depthSimple}
                  /> */}
                  {/* <ThumbnailTopo 
                    topology={simpleTopo[0]}
                    transverse={10}
                    vertical={3}
                  /> */}
                  {/* <TopoSimple
                    topology={simpleTopo[0]}
                    transverse={10}
                    vertical={3}>
                  </TopoSimple> */}
                  <IFrame attributes={attributes}
                    postMessageData={postMessageData}
                    handleReady={onReady}
                    handleReceiveMessage={onReceiveMessage} />
                </div>
                <div label="详图" key="topo" icon="topo" className="v-tab-pane">
                  <Legend />
                  <EchartsLoad data={topo} depth={depth} handleLoading={this.handleLoading} />
                </div>
              </VTabs>
            </div>
          )}

          <DrawerAnalysis visible={visible} onDrawClose={this.handleDrawerClose} />
          <DrawerAnalysisAll visible={visibleAll} onDrawClose={this.handleDrawerClose} lineId={lineId} />
        </Container>
      </Spin>
    )
  }
}
