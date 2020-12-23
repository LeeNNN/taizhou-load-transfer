import React, { Component, createRef } from "react"
import { Card, Typography, Popover, Spin, Modal, message, Button } from "antd"
import * as d3 from "d3"
import PopoverModal from "./PopoverModal"
import Container from "@/components/Container"
import DrawerAnalysis from "../ConfessionAnalysis/Drawer"
import * as SVGConfig from "@/utils/svgConfig"
import { getSvg, confessionAnalysis } from "@/api/svg"
import { setLineInvalid, getExportTrData, exportTrData } from "@/api/common"
import { source } from "@/utils/request"
import "./index.scss"
import LineNoData from "@/components/LineNoData"
import OutlineTabel from "./OutlineTabel"

const { confirm } = Modal
const { Text } = Typography

export default class Secondary extends Component {
  state = {
    lineId: "",
    lineName: "",
    lineInvalidReason: "",
    lineInvalid: false,
    resultCode: "1",
    visibleInvalid: false,
    deviceIds: [],
    visible: false,
    spinning: false,
    svgHtml: null,
    analysis: { errors: [], results: [] },
    loading: false,
    outLineResult: [], //停电的相关id数据
    outlineVisible: false,
    outlineData: [] //停电结果
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
            var keys = []
            // 所有停电的ID
            for (var key in SVGConfig.svgConfig.off_device_run_paths) {
              keys = keys.concat(
                Object.keys(SVGConfig.svgConfig.off_device_run_paths[key])
              )
            }
            _this.setState({
              outLineResult: keys
            })
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
    this.setState({
      outLineResult: []
    })
  }

  getSvg = lineId => {
    this.setState({ spinning: true, loading: false })
    const _this = this
    getSvg(lineId)
      .then(res => {
        console.log(res)
        if (!res.svgUrl) {
          this.setState({ spinning: false, svgHtml: null })
          this.refSvg.innerHTML = null
          message.destroy()
          return message.error("未获取到图模资源")
        }
        const svgUrl =
          process.env.NODE_ENV === "development" ? "http://192.168.1.178:28002" : window.location.origin
        //http://192.168.1.115:28002    http://192.168.2.187:8080
        SVGConfig.loadSvg(
          "#svgapp",
          {
            svgUrl: svgUrl + "/OCCA_web" + res.svgUrl
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
      .catch(_err => {
        console.log("err", _err)
        const { resultMsg, resultCode } = _err
        this.setState({ spinning: false, svgHtml: null, lineInvalidReason: resultMsg, resultCode })
      })
  }
  // 区间转供分析
  handleAnalysis = () => {
    this.setState({ visible: true })
  }
  // 关闭抽屉
  handleDrawerClose = () => {
    this.setState({ visible: false })
  }

  changeVisibleInvalid = () => {
    this.setState({
      visibleInvalid: true
    })
  }

  exportExcel = () => {
    getExportTrData(this.state.outLineResult).then(res => {
      const rdfIds = res.map(el => el.id) 
      console.log("rdfIds", rdfIds)
      window.open(`${process.env.REACT_APP_HOST}/${process.env.REACT_APP_BASEURL}/model/exportTrData?rdfIds=${rdfIds.join(",")}`)
    })
    // exportTrData(this.state.outLineResult).then(res => {
    //   console.log("res", res)
    //   // let blob = new Blob([res.data], {type: "application/vnd.ms-excel"})
    //   // // const blob = res
    //   // const reader = new FileReader()
    //   // reader.readAsDataURL(blob)
    //   // reader.onload = (e) => {
    //   //   const a = document.createElement("a")
    //   //   a.download = "20200707.xls"
    //   //   // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
    //   //   a.href = e.target.result
    //   //   document.body.appendChild(a)
    //   //   a.click()
    //   //   document.body.removeChild(a)
    //   // }

    //   const link = document.createElement("a")
    //   let blob = new Blob([res.data],{type: "application/vnd.ms-excel"})
    //   //获取heads中的filename文件名
    //   // let temp = res.headers["content-disposition"].split(";")[1].split("filename=")[1]
    //   //对文件名乱码转义--【Node.js】使用iconv-lite解决中文乱码
    //   // let iconv = require("iconv-lite") 
    //   //     iconv.skipDecodeWarning = true//忽略警告
    //   // let fileName = iconv.decode(temp, "gbk")
    //   // console.log("fileName_",fileName)
    //   // return
    //   link.style.display = "none"
    //   link.href = URL.createObjectURL(blob)
    //   link.setAttribute("download", "fileName.xls")
    //   // document.body.appendChild(link)
    //   link.click()
    //   // document.body.removeChild(link)

    // //   let data = res.data
    // //   if (data) {
    // //     let attrs = res.headers["content-disposition"].split(";")
    // // 　 // 获取文件名
    // //     let fileName = ""
    // //     // 不用管fileName在第几个位置，只要=前面是fileName,就取=后面的值
    // //     for (let i = 0, l = attrs.length; i < l; i++) {
    // //       let temp = attrs[i].split("=")
    // //       if (temp.length > 1 && temp[0] === "fileName") {
    // //         fileName = temp[1]
    // //         break
    // //       }
    // //     }
    // //     fileName = decodeURIComponent(fileName)
     
    // //     // 获取数据类型
    // //     let type = res.headers["content-type"].split(";")[0]
    // //     let blob = new Blob([res.data], { type: type })
    // //     const a = document.createElement("a")
    // //     // 创建URL
    // //     const blobUrl = window.URL.createObjectURL(blob)
    // //     a.download = "20200707.xlsx"
    // //     a.href = blobUrl
    // //     document.body.appendChild(a)
     
    // //     // 下载文件
    // //     a.click()
     
    // //     // 释放内存
    // //     URL.revokeObjectURL(blobUrl)
    // //     document.body.removeChild(a)
    //   // }
    // }).catch(err => {
    //   debugger
    //   console.log("err", err)
    // })
  }

  getOutlineResult = () => {
    // this.state.outLineResult
    getExportTrData(this.state.outLineResult).then(res => {
      console.log("getExportTrData res", res)
      this.setState({
        outlineVisible: true,
        outlineData: res
      })
    })
  }
  changeOutlineVisible = () => {
    this.setState({
      outlineVisible: false
    })
  }

  handleLineInvalidOk = () => {
    setLineInvalid(this.state.lineId).then(res => {
      this.props.changeVisibleInvalid(true)
      this.setState({
        visibleInvalid: false,
        lineInvalid: true
      })
    }).catch(_err => {
      const { resultMsg } = _err
      message.error(`设置无效报错原因: ${resultMsg}`)
    })
  }

  handleLineInvalidCancel = () => {
    this.setState({
      visibleInvalid: false
    })
  }

  componentDidMount() {
    const {
      currentNode: { id = "", name = "", invalid = false }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id, deviceIds: [], lineName: name, lineInvalid: invalid, resultCode: invalid ? "2" : "0", outLineResult: [] })
      this.getSvg(id)
    }
  }

  // 选择线路传递线路ID 会触发当前组件重绘
  componentDidUpdate() {
    const {
      currentNode: { id = "", name = "", invalid = false }
    } = this.props
    if (id && id !== this.state.lineId) {
      this.setState({ lineId: id, deviceIds: [], lineName: name, lineInvalid: invalid, resultCode: invalid ? "2" : "0", outLineResult: [] })
      this.getSvg(id)
    }
  }

  componentWillUnmount() {
    source.cancel()
  }

  render() {
    const {
      spinning = false,
      svgHtml,
      analysis: { errors, results },
      loading = false,
      deviceIds,
      visible,
      lineName,
      lineInvalidReason,
      lineInvalid,
      resultCode,
      visibleInvalid,
      outLineResult,
      outlineVisible,
      outlineData
    } = this.state
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
    const tableProps = {
      outlineVisible,
      outlineData,
      changeOutlineVisible: this.changeOutlineVisible
    }
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
                  {
                    outLineResult.length > 0 ?
                      (<span className="btn-margin-h">
                        <Button
                          className="btn-height"
                          type="primary"
                          onClick={this.getOutlineResult}
                        >
                          受影响配变
                      </Button>
                        <Button
                          className="btn-height"
                          type="primary"
                          onClick={this.exportExcel}
                        >
                          导出
                      </Button>
                      </span>) : ""
                  }
                  {/* <Button
                    className="btn-height"
                    type="success"
                    loading={loading}
                    disabled={!deviceIds.length}
                    onClick={this.handleAnalysis}
                  >
                    转供分析
                  </Button> */}
                  {/* <Popover
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
                  </Popover> */}
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
            style={{ background: "black", flex: 1 }} // #172341
            bodyStyle={{ height: "calc(100vh - 162px)", overflow: "hidden" }}
            className="v-card"
          >
            <div id="svgapp" ref={node => (this.refSvg = node)} />
            {!svgHtml && <LineNoData {...props} />}
            <DrawerAnalysis visible={visible} onDrawClose={this.handleDrawerClose} />
          </Card>
          <OutlineTabel
            {...tableProps}
          />
        </Container>
      </Spin>
    )
  }
}
