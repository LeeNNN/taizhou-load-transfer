import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { Tabs } from "antd"
import "./indexx.scss"

const { TabPane } = Tabs

const VTabs = props => {
  const { children, defaultActiveKey, onChange, tabs } = props
  const handleTabChange = useCallback(
    val => {
      onChange && onChange(val)
    },
    [onChange]
  )

  return tabs ? (
    <div className="v-tabs">
      <Tabs defaultActiveKey={defaultActiveKey} onChange={handleTabChange}>
        {tabs.map(tab => {
          return <TabPane tab={tab.label} key={tab.key} forceRender />
        })}
      </Tabs>
    </div>
  ) : children.length ? (
    <div className="v-tabs">
      <Tabs defaultActiveKey={defaultActiveKey} onChange={handleTabChange}>
        {children.map(child => {
          const {
            key = "",
            props: { label }
          } = child
          return (
            <TabPane tab={label || key} key={key} forceRender>
              {child}
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  ) : (
    <>{children}</>
  )
}

VTabs.propsTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  defaultActiveKey: PropTypes.string,
  tabs: PropTypes.array
}

export default VTabs
