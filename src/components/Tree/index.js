import React, { PureComponent } from "react"
import { withRouter } from "react-router-dom"
import { Menu, Icon } from "antd"
import "./index.scss"
const { SubMenu } = Menu

const flatTreeData = function flatTreeData (treeData, nodeKeys = []) {
  treeData.forEach(node => {
    nodeKeys.push(node)
    if (node.CHILDREN && node.CHILDREN.length) {
      flatTreeData(node.CHILDREN, nodeKeys)
    }
  })
  return nodeKeys
}

class Tree extends PureComponent {
  state = {
    openKeys: [],
    treeData: null,
    mapTreeData: null,
    selectedKeys: []
  }

  // 重置openKeys 
  resetOpenKeys = key => {
    let nodeKeys = []
    let { openKeys, mapTreeData } = this.state
    // 由于只展开一个父节点，所以openkeys存储的类型必然是从父节点往子节点一级级存储的
    // 查找key为某一节点的子节点，应当从当前已知的最后一层节点一层层向上查找
    // 所以需要reverse当前存储顺序openKeys然后再行遍历
    // openKeys = openKeys.reverse()
    openKeys.reverse().forEach((item, index) => {
      // mapTreeData是将树形结构全部展开存储在同一个数组当中，以便查找到当期那操作的节点
      const target = mapTreeData.find(node => node.ID === item)
      if (target) {
        // 查找当前展开的节点key是属于那一层节点的子节点
        const isExist = target.CHILDREN.some(node => node.ID === key)
        if (isExist) {
          // 一旦找到当前展开节点所属的子节点就不再向上查找，并从当前openkeys的index截取
          nodeKeys = openKeys.slice(index).reverse()
          // return false
        }
      }
    })
    return [...nodeKeys, key]
  }

  // subMenu展开闭合时，设置openKeys
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    const subMenuData = this.state.mapTreeData
    if (subMenuData.every(node => node.ID !== latestOpenKey)) {
      this.setState({ openKeys })
    } else {
      let openNewKeys = []
      openNewKeys = this.resetOpenKeys(latestOpenKey)
      this.setState({
        openKeys: latestOpenKey.length ? [...openNewKeys] : [],
      })
    }
  }

  componentDidMount () {
    this.props.history.listen(() => {
      this.setState({ openKeys: [] })
    })

    window.addEventListener("hashchange", () => {
      console.log("hash change")
    })
  }

  static getDerivedStateFromProps (props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that"s just the email.
    if (props.treeData !== state.treeData) {
      const mapTreeData = flatTreeData(props.treeData)
      return {
        // mapTreeData存储的是具有子节点节点，在组件当中表现的是subMenu
        mapTreeData: mapTreeData.filter(node => (node.CHILDREN && node.CHILDREN.length)),
        treeData: props.treeData
      }
    }
    return null
  }

  // 目的在于 切换路由时 清除选中状态
  menuOnClick = ({ key }) => {
    // console.log({ item, key, keyPath, domEvent })
    this.setState({ selectedKeys: [key] })
  }

  // 渲染树节点
  renderTree = (treeData, openKeys) => {
    const { onClick = () => { } } = this.props
    return treeData.map(node => {
      if (!node.CHILDREN || node.CHILDREN.length === 0) {
        return (<Menu.Item key={node.ID} onClick={e => onClick(e, node)}>{node.NAME}</Menu.Item>)
      } else {
        return (
          <SubMenu key={node.ID} title={
            <span>
              {openKeys.indexOf(node.ID) > -1 ? <Icon type="caret-down" /> : <Icon type="caret-right" />}
              <span>{node.NAME}</span>
            </span>
          }>
            {this.renderTree(node.CHILDREN, openKeys)}
          </SubMenu>
        )
      }
    })
  }

  render () {
    const { openKeys, treeData, selectedKeys } = this.state
    return (
      <div className="tree">
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          onClick={this.menuOnClick}
          theme="dark"
          inlineIndent={16}
          style={{ width: 200 }}
          selectedKeys={selectedKeys}
          className="nav-menu"
        >
          {
            treeData && this.renderTree(treeData, openKeys)
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(Tree)
