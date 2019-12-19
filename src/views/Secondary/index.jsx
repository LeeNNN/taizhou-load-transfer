import React, { Component, createRef } from "react"
import { Card, Typography, Popover, Spin, Modal, message, Button } from "antd"
import * as d3 from "d3"
import PopoverModal from "./PopoverModal"
import Container from "@/components/Container"
import * as SVGConfig from "@/utils/svgConfig"
import { getSvg, confessionAnalysis } from "@/api/svg"
import "./index.scss"
const { confirm } = Modal
const { Text } = Typography

export default class Secondary extends Component {
  state = {
    lineId: "",
    deviceIds: [],
    visible: false,
    spinning: false,
    svgHtml: null,
    analysis: { errors: [], results: [] },
    loading: false
  }

  refSvg = createRef()

  hide = () => {
    this.setState({
      visible: false
    })
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

  // 孤岛校核
  handleIslandCheck = () => {
    // console.log("孤岛校核")
    // console.log("孤岛", SVGConfig.svgConfig.lone_device)
    Object.keys(SVGConfig.svgConfig.lone_device).forEach(key => {
      d3.select("#" + key)
        .selectAll("polyline")
        .style("stroke", "orange")
      d3.select("#" + key)
        .selectAll("use")
        .style("stroke", "orange")
        .style("fill", "orange")
      d3.select("#" + key)
        .selectAll("polygon")
        .style("stroke", "orange")
    })
  }

  // 模拟停电
  handleAnalogPowerOutage = resultCallback => {
    const _this = this
    SVGConfig.startCutLine((deviceId, exist, statue, deviceName, deviceType) => {
      const {
        svgConfig: { power_run_paths }
      } = SVGConfig
      message.destroy()
      // 当前有电设备及线路
      let powerOnDevices = []
      Object.values(power_run_paths).forEach(device => {
        powerOnDevices = powerOnDevices.concat(Object.keys(device))
      })
      // 任何状态下 都允许闭合开关 而只有在通电状态下 才允许断开开关
      if (!powerOnDevices.includes(deviceId) && statue) {
        return message.error("当前设备" + deviceName + "，正处于断电状态")
      }

      const { deviceIds } = this.state
      // 只允许对负荷开关进行开闭合操作
      if (["loadbreakswitch", "disconnector", "breaker", "compositeswitch"].includes(deviceType)) {
        const msg = statue ? "断开" : "连接"
        if (statue) {
          deviceIds.push({ id: deviceId, name: deviceName })
        } else {
          let indexId = deviceIds.findIndex(deivice => deivice.id === deviceId)
          deviceIds.splice(indexId, 1)
        }

        confirm({
          title: "设备状态切换?",
          content: msg + `【${deviceName}】设备, 是否继续?`,
          onOk() {
            _this.setState({ deviceIds })
            SVGConfig.outUpdateCutLine(deviceId, statue)
          }
        })
      }
    })
  }

  handleReset = () => {
    // console.log("重置")
    // 清空断开开关
    this.setState({ deviceIds: [], loading: false })
    SVGConfig.resetConfigStatue()
  }

  getSvg = lineId => {
    this.setState({ spinning: true, loading: false })
    const _this = this
    getSvg(lineId).then(res => {
      if (!res.svgUrl) {
        this.setState({ spinning: false, svgHtml: null })
        this.refSvg.innerHTML = null
        message.destroy()
        return message.error("未获取到图模资源")
      }
      SVGConfig.loadSvg(
        "#svgapp",
        {
          svgUrl: window.location.origin + "/OCCA_web" + res.svgUrl
        },
        [{ id: res.sourceId, isPower: true, default: false }],
        error => {
          // SVGConfig.loadSvg("#svgapp", { svgUrl: "http://localhost:3000/resources/3.svg" }, [{ id: "pd_1111111", isPower: true, default: false }], (error) => {
          if (error) {
            _this.setState({ svgHtml: null })
            this.refSvg.innerHTML = null
            message.destroy()
            message.error("未获取到图模资源")
          } else {
            _this.setState({ svgHtml: true })
            this.searchDeviceList = []
            for (let key in SVGConfig.svgConfig.configs.devices) {
              const device = SVGConfig.svgConfig.configs.devices[key]
              this.searchDeviceList.push(device)
            }
          }
          _this.setState({ spinning: false })
        }
      )
    })
  }

  componentDidMount() {
    const {
      currentNode: { id = "" }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id, deviceIds: [] })
      this.getSvg(id)
    }
  }

  // 选择线路传递线路ID 会触发当前组件重绘
  componentDidUpdate() {
    const {
      currentNode: { id = "" }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id, deviceIds: [] })
      this.getSvg(id)
    }
  }

  render() {
    const {
      spinning = false,
      svgHtml,
      analysis: { errors, results },
      loading = false,
      deviceIds
    } = this.state
    return (
      <Spin spinning={spinning}>
        <Container>
          <Card
            title={
              svgHtml ? (
                <>
                  <Button
                    className="btn-height"
                    disabled={!svgHtml}
                    type="primary"
                    onClick={this.handleIslandCheck}
                  >
                    孤岛校核
                  </Button>
                  <Button className="btn-height" type="primary" onClick={this.handleAnalogPowerOutage}>
                    停电模拟
                  </Button>
                  <Popover
                    overlayClassName="analysis"
                    content={
                      <PopoverModal
                        onClose={this.hide}
                        devicesName={deviceIds}
                        errors={errors}
                        results={results}
                      />
                    }
                    placement="bottom"
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                  >
                    <Button
                      className="btn-height"
                      type="success"
                      loading={loading}
                      disabled={!deviceIds.length}
                    >
                      转供分析
                    </Button>
                  </Popover>
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: "20px",
                      padding: "0 17px",
                      cursor: "pointer",
                      color: "#ccc"
                    }}
                    onClick={this.handleReset}
                  >
                    重置
                  </Text>
                </>
              ) : null
            }
            bordered={false}
            style={{ background: "#172341", flex: 1 }}
            bodyStyle={{ height: "calc(100vh - 162px)" }}
            className="v-card"
          >
            {!svgHtml && <div className="no-data" />}
            <div id="svgapp" ref={node => (this.refSvg = node)} />
          </Card>
        </Container>
      </Spin>
    )
  }
}
