import React, { Component } from "react"
import { Modal, Table, Button } from "antd"

export default class OutlineTable extends Component {

  handleOk = () => {
    this.props.changeOutlineVisible()
  }
  handleCancel=() => {
    this.props.changeOutlineVisible()
  }

  render() {
    const { outlineVisible, outlineData } = this.props
    const tableData = outlineData.map(el => ({...el, key: el.id}))
    const columns = [
      {title: "id", dataIndex: "id", key:"id", render: text => (<span>{text}</span>)},
      {title: "配变名称", dataIndex: "name", key:"name", render: text => (<span>{text}</span>)},
      {title: "配变类型", dataIndex: "type", key:"type", render: text => (<span>{text}</span>)}
    ]
    return (
      <Modal
        title="停电受影响配变"
        visible={outlineVisible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            关闭
          </Button>
        ]}
      >
        <Table
        columns={columns}
        dataSource={tableData}
      />
      </Modal>
    )
  }
}