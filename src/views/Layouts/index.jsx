import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"
import { Layout, Spin } from "antd"
import TopHeader from "@/components/TopHeader"
import TreeNav from "@/components/Tree/Tree"
import NotFound from "@/views/404"
import loadable from "@loadable/component"
import { getTreeData } from "@/api/common"

// 组件的异步加载
const Load = loadable(() => import(/* webpackChunkName: "Load" */ "@/views/Load"))
const Secondary = loadable(() => import(/* webpackChunkName: "Secondary" */ "@/views/Secondary"))

const { Sider, Content } = Layout

class Layouts extends Component {
  state = {
    tree: [],
    loading: false,
    treeNode: {}
  }

  getTreeData = () => {
    const areaId = sessionStorage.getItem("user")
    this.setState({ loading: true })
    getTreeData(areaId)
      .then(res => {
        this.setState({ tree: res.areas })
      })
      .finally(() => this.setState({ loading: false }))
  }

  handleLogout = () => {
    this.props.history.push("/login")
  }

  handleTreeNodeClick = (node, val) => {
    this.setState({ treeNode: { ...val } })
  }
  changeVisibleInvalid=(invalid) => {
    console.log("invalid", invalid)
    const {treeNode} = this.state
    this.setState({ treeNode: { ...treeNode, invalid: true } }, () => {
      console.log("invalid state", this.state.treeNode)
    })
    const treeList = this.flatTree(this.state.tree)
    const node = treeList.find(el => el.id === this.state.treeNode.id)
    node.invalid = true
  }
  flatTree(arr) {
    const result = arr.reduce((arr1, el) => {
      arr1.push(el)
      if (el.children) {
        arr1.push(...this.flatTree(el.children))
      }
      return arr1
    }, [])
    return result
  }
  componentDidMount() {
    this.getTreeData()
  }

  render() {
    // const isLogin = !!sessionStorage.getItem("user")
    // const isLogin = true
    const { tree, treeNode, loading } = this.state
    // if (isLogin) {
    return (
      <Layout>
        <TopHeader onLogout={this.handleLogout} />
        <Layout style={{ background: "#031031" }}>
          <Sider style={{ background: "#0d2944" }}>
            <Spin spinning={loading}>
              <TreeNav treeData={tree} onClick={this.handleTreeNodeClick} />
            </Spin>
          </Sider>
          <Content style={{ padding: 16 }}>
            <Switch>
              <Route path="/load">
                <Secondary currentNode={treeNode} changeVisibleInvalid={this.changeVisibleInvalid}/>
              </Route>
              <Route path="/topology">
                <Load currentNode={treeNode} changeVisibleInvalid={this.changeVisibleInvalid} />
              </Route>
              <Route path="/*" component={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
    // } else {
    //   return (
    //     <Redirect to={`/login?redirect=${ this.props.history.location.pathname }`} />
    //   )
    // }
  }
}

export default Layouts
