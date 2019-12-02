import React, { Component } from "react"
import axios from "axios"
import { Card, Tag, Typography, Popover, Spin, Modal, message } from "antd"
import * as d3 from "d3"
import PopoverModal from "./PopoverModal"
import Container from "@/components/Container"
import * as SVGConfig from "@/utils/svgConfig"
import { getSvg } from "@/api/svg"
import { requestSvg } from "@/utils/request"
import FileSvg from "./FileSvg"
import "./index.scss"
const { confirm } = Modal
const { Text } = Typography

export default class Secondary extends Component {
  state = {
    lineId: null,
    visible: false,
    loading: false,
    svgHtml: null
  }

  hide = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleChange = visible => {
    this.setState({ visible })
    if (visible) {
      console.log("转供分析")
    }
  }

  handleIslandCheck = () => {
    console.log("孤岛校核")
    console.log("孤岛", SVGConfig.svgConfig.lone_device)
    Object.keys(SVGConfig.svgConfig.lone_device).forEach(key => {
      d3.select("#" + key).selectAll("polyline").style("stroke", "orange")
      d3.select("#" + key).selectAll("use").style("stroke", "orange").style("fill", "orange")
      d3.select("#" + key).selectAll("polygon").style("stroke", "orange")
    })

  }

  handleAnalogPowerOutage (resultCallback) {
    SVGConfig.startCutLine((deviceId, exist, statue, deviceName, deviceType) => {
      console.log(deviceId, exist, statue, deviceName, deviceType)
      // 只允许对负荷开关进行开闭合操作
      if ("loadbreakswitch" === deviceType) {
        var message = statue ? "断开" : "连接"
        confirm({
          title: "设备状态切换?",
          content: message + `【${ deviceName }】设备, 是否继续?`,
          onOk () {
            console.log(deviceId, exist, statue)
            SVGConfig.outUpdateCutLine(deviceId, exist, statue)
          }
        })
      }
    })
  }

  handleReset = () => {
    console.log("重置")
    SVGConfig.resetConfigStatue()
  }

  getSvg = lineId => {
    this.setState({ loading: true })
    axios({
      url: "/resources/1.svg",
      method: "GET",
      headers: {
        "content-type": "image/svg+xml"
      }
    }).then(res => {
      // this.setState({
      //   svgHtml: res.data,
      //   loading: false
      // })
      SVGConfig.loadSvg("#svgapp", { svgUrl: "http://localhost:3000/resources/1.svg" }, [{ id: "PD_30500000_554082", isPower: true, default: false }], (error) => {
        this.loading = false
        if (error) {
          message.error("未获取到图模资源")
        } else {
          this.searchDeviceList = []
          for (var key in SVGConfig.svgConfig.configs.devices) {
            var device = SVGConfig.svgConfig.configs.devices[key]
            this.searchDeviceList.push(device)
          }

        }
        this.setState({ loading: false, svgHtml: res.data })
      })
    })
    // 115967692082512943
    // getSvg().then(res => {
    //   console.log("=========", res)
    //   requestSvg(res.svgUrl).then(res => {
    //     this.setState({
    //       svgHtml: res,
    //       loading: false
    //     })
    //     // this.loading = false
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

  /* componentDidUpdate () {
    const { currentNode: { ID = "" } } = this.props
    if (ID && ID !== this.state.lineId) {
      this.setState({ lineId: ID })
      this.getSvg(ID)
    }
  } */

  render () {
    // console.log(this.props)
    const { loading = false, svgHtml } = this.state
    return (
      <Spin spinning={loading}>
        <Container>
          <Card
            title={
              <>
                <Tag className="tag-height" color="#1c6ecf" onClick={this.handleIslandCheck}>孤岛校核</Tag>
                <Tag className="tag-height" style={{ cursor: svgHtml ? "cursor" : "not-allowed" }} color="#1c6ecf" onClick={this.handleAnalogPowerOutage}>停电模拟</Tag>
                <Popover
                  overlayClassName="analysis"
                  content={<PopoverModal onClose={this.hide} />}
                  placement="bottom"
                  trigger="click"
                  visible={this.state.visible}
                  onVisibleChange={this.handleVisibleChange}
                >
                  <Tag className="tag-height" color="#36a18d">转供分析</Tag>
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
      </Spin>
    )
  }
}
