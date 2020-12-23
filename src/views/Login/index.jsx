import React, { Component } from "react"
import { withRouter } from "react-router"
import { Form, Input, Button, Checkbox, Spin, message } from "antd"
import { doLogin /* getUserKey */ } from "@/api/user"
import { patternPassword, patternUsername } from "@/utils/pattern.constant"
// import { JSEncrypt } from "jsencrypt"

class Secondary extends Component {
  state = {
    loading: false
  }

  componentDidMount() {
    sessionStorage.removeItem("user")
  }

  /**
   * 用户登录请求
   * @param username 用户名称
   * @param password 登录密码
   * @returns Promise
   */
  doLogin = (username, passwd) => {
    this.setState({ loading: true })
    doLogin(username, passwd).then(res => {
      // console.log(res)
      sessionStorage.setItem("user", "user")
      this.setState({ loading: false })
      // 重定向到用户期望的页面，用户在地址栏输入的地址
      const redirect = this.props.history.location.search.split("=")[1] || "/topology"
      this.props.history.push(redirect)
    })
  }

  // 登录按钮点击事件，进行表单校验、发送异步请求
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { username, password, remember } = values
        // 是否记住用户名
        if (remember) {
          localStorage.setItem("username", username)
        } else {
          localStorage.getItem("username") && localStorage.removeItem("username")
        }
        this.doLogin(username, password)
      }
    })
  }

  componentWillUnmount() {
    message.destroy()
  }

  render() {
    const { loading } = this.state
    const { getFieldDecorator } = this.props.form
    const username = localStorage.getItem("username") || null
    return (
      <div className="login">
        <div className="login-form">
          <h3>泰州配网负荷转供分析系统</h3>
          <Spin spinning={loading}>
            <div className="form">
              <Form colon={false} hideRequiredMark onSubmit={this.handleSubmit}>
                <Form.Item label="用户名">
                  {getFieldDecorator("username", {
                    initialValue: username,
                    rules: [
                      { required: true, message: "用户名不能为空", trigger: ["blur", "change"] },
                      { pattern: patternUsername, message: "字符开头，4到10位字符数字组成" }
                    ]
                  })(<Input allowClear placeholder="请输入用户名" autoComplete="off" size="large" />)}
                </Form.Item>
                <Form.Item label="密码">
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: "密码不能为空" },
                      { pattern: patternPassword, message: "长度6到20位的数字字母" }
                    ]
                  })(<Input.Password placeholder="请输入密码" autoComplete="off" size="large" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("remember", {
                    valuePropName: "checked",
                    initialValue: !!username
                  })(<Checkbox>记住用户名</Checkbox>)}
                </Form.Item>
                <Form.Item>
                  <Button block size="large" htmlType="submit" className="btn-login">
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

export default withRouter(Form.create({ name: "Login" })(Secondary))
