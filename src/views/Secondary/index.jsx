import React, { PureComponent } from "react"
import axios from "axios"
import { Card, Typography, Popover, Spin, Modal, message, Button } from "antd"
import * as d3 from "d3"
import PopoverModal from "./PopoverModal"
import Container from "@/components/Container"
import * as SVGConfig from "@/utils/svgConfig"
import { getSvg, confessionAnalysis } from "@/api/svg"
import { requestSvg } from "@/utils/request"
import FileSvg from "./FileSvg"
import "./index.scss"
const { confirm } = Modal
const { Text } = Typography

export default class Secondary extends PureComponent {
  state = {
    lineId: null,
    deviceId: null,
    visible: false,
    spinning: false,
    svgHtml: null,
    connections: 0, // 断开开关的个数
    deviceName: null,
    analysis: { on: [], off: [], lines: [] },
    loading: false
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleChange = visible => {
    this.setState({ loading: true })
    const { lineId = null, deviceId = null } = this.state
    console.log(lineId, deviceId)
    console.time("startAnalysis")
    // if (lineId && deviceId) {
    // confessionAnalysis("115967692082511999", "PD_30700000_30700002@3070371@1").then(res => {
    confessionAnalysis(lineId, deviceId).then(res => {
      console.log("转供分析：", res)
      if (res.analyse && res.analyse.length) {
        console.timeEnd("startAnalysis")
        const analysis = res.analyse.reduce((accu, curr) => {
          accu.on.push(curr.switchOnCbLine + "-" + curr.switchOnCbName)
          accu.off.push(curr.switchOutName)
          accu.lines.push({ name: curr.lineName, cap: +curr.lineCap })
          return accu
        }, { on: [], off: [], lines: [] })
        console.log(analysis)
        this.setState({ analysis, visible })
      } else {
        // 转供分析失败
        message.error(res.resultMsg)
        // todo 是否调用重置事件
        this.handleReset()
      }
    }).finally(() => {
      this.setState({ loading: false })
    })
    // }

    if (!visible) {
      this.setState({ analysis: { on: [], off: [], lines: [] }, visible })
    }
  }

  // 孤岛校核
  handleIslandCheck = () => {
    console.log("孤岛校核")
    console.log("孤岛", SVGConfig.svgConfig.lone_device)
    Object.keys(SVGConfig.svgConfig.lone_device).forEach(key => {
      d3.select("#" + key).selectAll("polyline").style("stroke", "orange")
      d3.select("#" + key).selectAll("use").style("stroke", "orange").style("fill", "orange")
      d3.select("#" + key).selectAll("polygon").style("stroke", "orange")
    })
  }

  // 模拟停电
  handleAnalogPowerOutage = resultCallback => {
    const _this = this
    let { connections } = this.state

    SVGConfig.startCutLine((deviceId, exist, statue, deviceName, deviceType) => {
      // console.log(deviceId, exist, statue, deviceName, deviceType)
      // 只允许对负荷开关进行开闭合操作
      if ("loadbreakswitch" === deviceType) {
        const msg = statue ? "断开" : "连接"
        console.log("======", connections)
        if (connections > 0) {
          return message.error("只能断开一个开关模拟停电和转供分析，请先闭合已经断开的开关！")
        }
        connections = statue ? ++connections : --connections
        _this.setState({ connections, deviceId: statue ? deviceId : null, deviceName: statue ? deviceName : null })

        confirm({
          title: "设备状态切换?",
          content: msg + `【${ deviceName }】设备, 是否继续?`,
          onOk () {
            SVGConfig.outUpdateCutLine(deviceId, exist, statue)
          }
        })
      }
    })
  }

  handleReset = () => {
    console.log("重置")
    // 清空断开开关的个数为哦
    this.setState({ connections: 0 })
    SVGConfig.resetConfigStatue()
  }

  getSvg = lineId => {
    this.setState({ spinning: true })
    axios({
      url: "/resources/1.svg",
      method: "GET",
      headers: {
        "content-type": "image/svg+xml"
      }
    }).then(res => {
      // this.setState({
      //   svgHtml: res.data,
      //   spinning: false
      // })
      SVGConfig.loadSvg("#svgapp", { svgUrl: "http://localhost:3001/resources/1.svg" }, [{ id: "PD_30500000_554082", isPower: true, default: false }], (error) => {
        this.spinning = false
        if (error) {
          message.error("未获取到图模资源")
        } else {
          this.searchDeviceList = []
          for (let key in SVGConfig.svgConfig.configs.devices) {
            const device = SVGConfig.svgConfig.configs.devices[key]
            this.searchDeviceList.push(device)
          }
        }
        this.setState({ spinning: false, svgHtml: res.data })
      })
    })
    // 115967692082512943
    // getSvg().then(res => {
    //   console.log("=========", res)
    //   requestSvg(res.svgUrl).then(res => {
    //     this.setState({
    //       svgHtml: res,
    //       spinning: false
    //     })
    //     // this.spinning = false
    //     // if (res && res.data) {
    //     //   // 在点击🌲节点的时候， 就能获取到val.table了，但是只有在svg展示的时候，才能展示这些数据
    //     //   this.dealWithLineData(val.lineInfo)
    //     //   this.svgSrc = res.data
    //     //   this.buildConnect()
    //     // }
    //   })
    // })
  }

  componentDidMount () {
    this.getSvg()
  }

  componentDidUpdate () {
    const { currentNode: { ID = "" } } = this.props
    if (ID && ID !== this.state.lineId) {
      this.setState({ lineId: ID, deviceName: null, deviceId: null })
      this.getSvg(ID)
    }
  }

  render () {
    // console.log(this.props)
    const { spinning = false, svgHtml, deviceName = "", analysis, loading = false } = this.state
    return (
      <Spin spinning={spinning}>
        <Container>
          <Card
            title={
              <>
                <Button
                  className="btn-height"
                  disabled={!!svgHtml}
                  type="primary"
                  onClick={this.handleIslandCheck}
                >孤岛校核</Button>
                <Button
                  className="btn-height"
                  type="primary"
                  onClick={this.handleAnalogPowerOutage}
                >停电模拟</Button>
                <Popover
                  overlayClassName="analysis"
                  content={<PopoverModal onClose={this.hide} deviceName={deviceName} analysis={analysis} />}
                  placement="bottom"
                  trigger="click"
                  visible={this.state.visible}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <Button
                    className="btn-height"
                    type="success"
                    loading={loading}
                    disabled={!deviceName}
                  >转供分析</Button>
                </Popover>
                <Text
                  style={{ fontSize: 12, lineHeight: "20px", padding: "0 17px", cursor: "pointer", color: "#ccc" }}
                  onClick={this.handleReset}
                >重置</Text>
              </>
            }
            bordered={false}
            style={{ background: "#172341", flex: 1 }}
            className="v-card"
          >
            {/* <FileSvg svgHtml={svgHtml} /> */}
            <div id="svgapp"></div>
          </Card>
        </Container>
      </Spin >
    )
  }
}
