import React, { useState, useEffect, useCallback, useRef } from "react"
import PropTypes from "prop-types"
import { DatePicker, Form, Button } from "antd"
import moment from "moment"
import "moment/locale/zh-cn"
import "./index.scss"
moment.locale("zh-cn")

// 初始化日期的时间为当天24点
const initialDate = new Date()
initialDate.setHours(24, 0, 0)

// 缓存转供分析选择的日期范围
let oldValue = {}
let oldLineId = null

const DatePickerCustom = props => {
  const { form, onSubmit, lineId, drawerVisible } = props

  const endDateRef = useRef()

  // console.log("===", props)
  const { getFieldDecorator, setFieldsValue, validateFields } = form

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(initialDate)

  // 起始日期进行选择操作
  const onChangeStartDate = useCallback(
    (date, dateString) => {
      setStartDate(+moment(date).format("x"))
      setFieldsValue({
        endDate: null
      })
      // console.log("endDateRef.current:", endDateRef)
      // endDateRef.current.focus()
    },
    [setFieldsValue]
  )

  // 数据提交
  const handleSubmit = useCallback(() => {
    validateFields((err, { startDate, endDate }) => {
      if (!err) {
        const date = { startDate: startDate.format("YYYY-MM-DD"), endDate: endDate.format("YYYY-MM-DD") }
        if (JSON.stringify(date) !== JSON.stringify(oldValue) || lineId !== oldLineId) {
          oldValue = date
          oldLineId = lineId
          onSubmit(date)
        }
      }
    })
  }, [onSubmit, validateFields, lineId])

  // 设置起始日期不可用范围
  const disabledStartDate = useCallback(
    startValue => {
      if (!startValue || !endDate) {
        return false
      }
      return startValue.valueOf() > endDate
    },
    [endDate]
  )

  // 设置结束日期不可用范围
  const disabledEndDate = useCallback(
    endValue => {
      if (!endValue || !startDate) {
        return false
      }
      return (
        endValue.valueOf() <= startDate ||
        endValue.valueOf() > startDate + 7 * 24 * 60 * 60 * 1000 ||
        endValue.valueOf() > Date.now()
      )
    },
    [startDate]
  )

  useEffect(() => {
    return () => {
      setStartDate(null)
      setEndDate(initialDate)
      setFieldsValue({
        startDate: null,
        endDate: null
      })
    }
  }, [drawerVisible, setFieldsValue])

  return (
    <Form layout="inline" onSubmit={handleSubmit} className="form-date">
      <Form.Item>
        {getFieldDecorator("startDate", {
          rules: [{ required: true, message: "起始日期不能为空！" }]
        })(
          <DatePicker
            onChange={onChangeStartDate}
            placeholder="请选择日期"
            disabledDate={disabledStartDate}
            allowClear={false}
            mode="date"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("endDate", {
          rules: [{ required: true, message: "结束日期不能为空" }]
        })(
          <DatePicker
            placeholder="请选择日期"
            disabledDate={disabledEndDate}
            allowClear={false}
            ref={endDateRef}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  )
}

DatePickerCustom.propTypes = {
  form: PropTypes.object,
  onSubmit: PropTypes.func
}

export default Form.create({ name: "DatePicker" })(DatePickerCustom)
