import React, { useState, useEffect, useCallback } from "react"
import { Drawer, Table, Divider } from "antd"
import VText from "@/components/VText"
import VTitle from "@/components/VTitle"
import "./index.scss"

const { Column } = Table

const data = [
  {
    key: "1",
    type: "专变",
    user: "泰州市鑫灵塑料制品有限公司"
  },
  {
    key: "2",
    type: "公变",
    user: "陈庄一组西边315kVA"
  },
  {
    key: "3",
    type: "公变",
    user: "集镇公用配变400kVA"
  },
  {
    key: "4",
    type: "公变",
    user: "城中十三组变200kVA"
  }
]

const DrawerAnalysis = props => {
  const { visible = false, onDrawClose } = props
  const [confessionLines, setConfessionLines] = useState([])

  const onClose = useCallback(() => {
    if (typeof onDrawClose === "function") onDrawClose()
  }, [onDrawClose])

  useEffect(() => {
    setConfessionLines([
      {
        lineName: "10kv五菱线",
        capacity: "120kVA",
        users: ["泰州市鑫灵塑料制品有限公司", "陈庄一组西边315kVA"],
        load: "50kVA"
      }
    ])
  }, [])

  return (
    <Drawer
      title="负荷转供分析结果"
      placement="right"
      width={600}
      onClose={onClose}
      visible={visible}
      className="drawer"
      mask={false}
      style={{ top: 80 }}
      drawerStyle={{ background: "none" }}
      headerStyle={{ background: "none", borderBottom: "solid 1px rgba(0,0,0,0.6)", color: "#fff" }}
    >
      <VTitle level={2}>用户操作</VTitle>
      <div>
        <p>
          <VText type="success">断开</VText>了白镇新牧005开关
        </p>
        <p>
          <VText type="danger">断开</VText>了白镇新牧005开关
        </p>
      </div>
      <VTitle level={2}>受影响的用户</VTitle>

      <Table dataSource={data} pagination={{ hideOnSinglePage: true }} bordered size="small">
        <Column
          title="类型"
          dataIndex="type"
          key="type"
          render={(value, row, index) => {
            const obj = {
              children: value,
              props: {}
            }
            if (index === 1) {
              obj.props.rowSpan = 2
            }
            // These two are merged into above cell
            if (index === 2) {
              obj.props.rowSpan = 0
            }
            return obj
          }}
        />
        <Column title="用户" dataIndex="user" key="user" align="center" />
      </Table>
      <VTitle level={2}>转供方案</VTitle>
      <VTitle level={3}>建议操作</VTitle>
      <div>
        <p>
          <VText type="success">断开</VText>了白镇新牧005开关
        </p>
        <p>
          <VText type="danger">断开</VText>了白镇新牧005开关
        </p>
      </div>
      <VTitle level={3}>转供线路</VTitle>
      <Table
        dataSource={confessionLines}
        pagination={{ hideOnSinglePage: true }}
        bordered
        size="small"
        rowKey="lineName"
      >
        <Column title="线路" dataIndex="lineName" key="lineName" />
        <Column title="剩余容量" dataIndex="capacity" key="capacity" width={80} align="center" />
        <Column
          title="转供用户"
          dataIndex="users"
          key="users"
          render={(value, record, index) => {
            return value.map((item, idx) => {
              return (
                <span key={item}>
                  {idx !== 0 ? <Divider type="vertical" /> : null}
                  <span>{item}</span>
                </span>
              )
            })
          }}
        />
        <Column title="所需负荷" dataIndex="load" key="load" width={80} align="center" />
      </Table>
    </Drawer>
  )
}

export default DrawerAnalysis
