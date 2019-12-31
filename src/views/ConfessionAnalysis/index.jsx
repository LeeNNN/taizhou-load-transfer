import React, { useState, useCallback } from "react"
import { Button, Popover, message } from "antd"
import { confessionAnalysis } from "@/api/svg"
import PopoverModal from "../Secondary/PopoverModal"
import "./index.scss"
import { useEffect } from "react"

const ConfessionAnalysis = props => {
  const { lineId, deviceIds } = props

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  // const [deviceIds, setDeviceIds] = useState([])
  const [errors, setErrors] = useState([])
  const [results, setResults] = useState([])

  const [disabled, setDisabled] = useState(true)
  const hide = useCallback(() => {
    setVisible(false)
  }, [])

  const handleVisibleChange = useCallback(() => {
    // console.log("-----")
    if (disabled) return
    setLoading(true)
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
          // setDeviceIds()
          setErrors(errors)
          setResults(results)
          setVisible(false)
          // this.setState({ analysis: { errors, results }, visible })
        } else {
          // 转供分析失败
          message.error(res.resultMsg)
          setLoading(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [lineId, deviceIds, disabled])

  useEffect(() => {
    setDisabled(!deviceIds.length)
  }, [deviceIds])

  return (
    <Popover
      overlayClassName="analysis"
      content={<PopoverModal onClose={hide} devicesName={deviceIds} errors={errors} results={results} />}
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button className="btn-height" type="success" loading={loading} disabled={disabled}>
        转供分析
      </Button>
    </Popover>
  )
}

export default ConfessionAnalysis
