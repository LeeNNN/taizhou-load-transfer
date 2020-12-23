import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { Menu, Icon } from "antd"
import "./index.scss"

const { SubMenu } = Menu

const flatTreeData = function flatTreeData(treeData, nodeKeys = []) {
  treeData.forEach(node => {
    nodeKeys.push(node)
    if (node.children && node.children.length) {
      flatTreeData(node.children, nodeKeys)
    }
  })
  return nodeKeys
}

const TreeNav = props => {
  const { treeData, onClick } = props
  const [list, setList] = useState([])
  const [selectedKeys, setSelected] = useState([])
  const [openKeys, setOpened] = useState([])
  // const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([])
  // const [defaultOpenKeys, setDefaultOpenKeys] = useState(["sub1","sub2"])

  useEffect(() => {
    const listMenu = flatTreeData(treeData.filter(node => node.children && node.children.length))
    setList(listMenu)
    // debugger
    const [node] = treeData
    const [node1] = node?node.children:[]
    const [node2] = node1?node1.children:[]
    const arr = []
    if (node) {
      arr.push(...[node.id, node1.id, node2.id])
    }
    // setSelected(arr)
    // console.log("selectedKeys", selectedKeys)
    // debugger
    // setDefaultSelectedKeys(arr)
    // setDefaultOpenKeys(["sub1", "sub2"])
  }, [treeData,selectedKeys])

  // 重置openKeys
  const resetOpenKeys = useCallback(
    key => {
      let nodeKeys = []
      // 由于只展开一个父节点，所以openkeys存储的类型必然是从父节点往子节点一级级存储的
      // 查找key为某一节点的子节点，应当从当前已知的最后一层节点一层层向上查找
      // 所以需要reverse当前存储顺序openKeys然后再行遍历
      // openKeys = openKeys.reverse()
      openKeys.reverse().forEach((item, index) => {
        // mapTreeData是将树形结构全部展开存储在同一个数组当中，以便查找到当期那操作的节点
        const target = list.find(node => node.id === item)
        if (target) {
          // 查找当前展开的节点key是属于那一层节点的子节点
          const isExist = target.children.some(node => node.id === key)
          if (isExist) {
            // 一旦找到当前展开节点所属的子节点就不再向上查找，并从当前openkeys的index截取
            nodeKeys = openKeys.slice(index).reverse()
            // return false
          }
        }
      })
      return [...nodeKeys, key]
    },
    [list, openKeys]
  )

  // 菜单点击事件
  const menuOnClick = useCallback(({ key }) => {
    setSelected([key])
  }, [])

  // 菜单打开事件
  const onOpenChange = useCallback(
    keys => {
      // debugger
      const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
      console.log(latestOpenKey)
      if (list.every(node => node.id !== latestOpenKey)) {
        setOpened(keys)
      } else {
        console.log(latestOpenKey)
        let openNewKeys = []
        openNewKeys = resetOpenKeys(latestOpenKey)
        setOpened(latestOpenKey.length ? [...openNewKeys] : [])
      }
    },
    [list, openKeys, resetOpenKeys]
  )

  const handleNodeClick = useCallback(
    (e, node) => {
      onClick(e, node)
    },
    [onClick]
  )

  const renderNode = useCallback(
    nodes => {
      return nodes.map(node => {
        if (!node.children || node.children.length === 0) {
          return (
            <Menu.Item key={node.id} onClick={e => handleNodeClick(e, node)}>
              {node.name}
            </Menu.Item>
          )
        } else {
          return (
            <SubMenu
              key={node.id}
              title={
                <span>
                  {openKeys.indexOf(node.id) > -1 ? <Icon type="caret-down" /> : <Icon type="caret-right" />}
                  <span>{node.name}</span>
                </span>
              }
            >
              {renderNode(node.children, openKeys)}
            </SubMenu>
          )
        }
      })
    },
    [handleNodeClick, openKeys]
  )

  return (
    <div className="tree">
      {treeData ? (
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={menuOnClick}
          theme="dark"
          inlineIndent={12}
          selectedKeys={selectedKeys}
          className="nav-menu"
        >
          {renderNode(treeData)}
        </Menu>
      ) : null}
    </div>
  )
}

TreeNav.propTypes = {
  treeData: PropTypes.array
}

TreeNav.defaultProps = { treeData: [] }

export default TreeNav
