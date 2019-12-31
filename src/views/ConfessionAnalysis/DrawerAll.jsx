import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { Drawer, Table, Typography } from "antd"
import DatePicker from "@/components/DatePicker"
import VTitle from "@/components/VTitle"
import Descriptions from "@/components/Descriptions"
import Loading from "@/components/Loading"
import { analysisLineConfession } from "@/api/common"
import "./index.scss"

const { Column } = Table
const { Text } = Typography

const DrawerAll = props => {
  const { visible, onDrawClose, lineId } = props

  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  const [tableData, setTableData] = useState([])

  const [tip, setTip] = useState("")

  const onClose = useCallback(() => {
    if (typeof onDrawClose === "function") onDrawClose()
  }, [onDrawClose])

  const onSubmit = useCallback(
    ({ startDate, endDate }) => {
      // console.log(startDate, endDate)
      setLoading(true)
      analysisLineConfession(lineId, startDate, endDate)
        .then(res => {
          // console.log(res)
          const { currentLines, zgfas, errorMsg } = res
          if (currentLines && currentLines.length) {
            const list = currentLines.map(item => {
              return {
                name: item.date,
                value: item.maxCur + "A" || 0
              }
            })
            setList(list)
          }
          if (zgfas && zgfas.length) {
            const tableData = zgfas.map(item => {
              return {
                ...item,
                id: Math.random()
                  .toString(16)
                  .slice(2, 12)
              }
            })
            setTableData(tableData)
          }
          // console.log("errorm", errorMsg)
          if (!tableData || !tableData.length) setTip("未查询到转供方案！")
          if (errorMsg) setTip(errorMsg)
        })
        .catch(_err => setLoading(false))
        .finally(() => setLoading(false))
    },
    [lineId, tableData]
  )

  useEffect(() => {
    return () => {
      if (visible) {
        setList([])
        setTableData([])
        setTip("")
      }
    }
  }, [visible])

  return (
    <Drawer
      title="负荷转供分析结果"
      placement="right"
      width={600}
      onClose={onClose}
      visible={visible}
      className="drawer"
      mask={false}
      style={{ top: 80, height: "calc(100% - 80px)" }}
      drawerStyle={{ background: "none" }}
      headerStyle={{ background: "none", borderBottom: "solid 1px rgba(0,0,0,0.6)", color: "#fff" }}
    >
      {loading ? <Loading /> : null}
      <VTitle>请选择线路负荷参考模型时间区间</VTitle>
      <DatePicker onSubmit={onSubmit} lineId={lineId} drawerVisible={visible} />
      <VTitle style={{ marginTop: 24 }}>参考模型时间区间最大电流</VTitle>
      <Descriptions list={list} />
      <VTitle style={{ marginTop: 24, marginBottom: 20 }}>转供方案建议</VTitle>
      {tableData.length ? (
        <Table dataSource={tableData} pagination={{ hideOnSinglePage: true }} bordered size="small" rowKey="id">
          {tableData.length > 1 ? (
            <Column
              title="候选方案"
              key="method"
              render={(value, row, index) => <span>{index + 1}</span>}
              align="center"
              width={80}
            />
          ) : null}
          <Column title="转供线路" dataIndex="otherLineName" key="otherLineName" />
          <Column title="开关操作" dataIndex="concatCbName" key="concatCbName" />
          <Column
            title="转供后最大电流"
            dataIndex="restMaxCur"
            key="restMaxCur"
            width={120}
            render={value => <span>{value}A</span>}
          />
          <Column
            title="转供后负载率"
            dataIndex="ratio"
            key="ratio"
            render={(value, row, index) => <span style={index === 0 ? { color: "#f60" } : null}>{value}</span>}
            width={100}
            align="center"
          />
        </Table>
      ) : (
        <Text type="secondary" style={{ color: "rgba(255,255,255, 0.6)" }}>
          {tip}
        </Text>
      )}
    </Drawer>
  )
}

DrawerAll.propTypes = {
  visible: PropTypes.bool,
  onDrawClose: PropTypes.func
}

export default DrawerAll
