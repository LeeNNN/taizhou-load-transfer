import React from "react"
import { Modal } from "antd"
import { Component } from "react"
export default class LineInvalid extends Component {
  onclick = () => {
    this.props.handleOk()
  }
  render(h) {
    const { visibleInvalid, handleCancel, lineName, lineInvalidReason} = this.props
    const { onclick } = this
    return (
      <Modal
        title="确定设为无效"
        visible={visibleInvalid}
        onOk={onclick}
        onCancel={handleCancel}
        okText="设为无效"
      >
        <p>{`当前线路: ${lineName}`}</p>
        <p>{`无数据原因: ${lineInvalidReason}`}</p>
      </Modal>
    )
  }
}