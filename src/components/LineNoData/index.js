import React, { Component } from "react"
import { Button } from "antd"
import LineInvalid from "@/components/LineInvalid"
export default class LineNoData extends Component {
  // containerRef = createRef()
  render(h) {
    const { lineName, lineInvalid, resultCode, changeVisibleInvalid, handleLineInvalidOk, handleLineInvalidCancel } = this.props
    return (
      <div className="no-data">
        <div > 
          {/* ref={node => (this.containerRef = node)}  */}
          {+resultCode === 2 ? lineInvalid ? <p>{`当前线路 ${lineName} 状态: 无效`}</p> :
            (<Button
              className="btn-height"
              type="success"
              onClick={changeVisibleInvalid}
              style={{ marginRight: 20 }}
            >设为无效</Button>)
            : ("")
          }
        </div>
        <LineInvalid
          {...this.props}
          handleOk={handleLineInvalidOk}
          handleCancel={handleLineInvalidCancel} />
      </div>
    )
  }
}