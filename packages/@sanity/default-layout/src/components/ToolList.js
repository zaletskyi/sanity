import PropTypes from 'prop-types'
import React from 'react'
import PluginIcon from 'part:@sanity/base/plugin-icon'

import styles from './styles/ToolList.css'

function ToolList(props) {
  const {activeToolName, renderItem, showIcon, showLabel, tools} = props

  return (
    <ul className={styles.root}>
      {tools.map(tool => {
        const isActive = activeToolName === tool.name
        const itemClassName = isActive ? styles.activeItem : styles.item
        const Icon = tool.icon || PluginIcon

        const children = (
          <>
            {showIcon && (
              <span className={styles.toolIconContainer}>
                <Icon />
              </span>
            )}
            {showLabel && <span className={styles.toolLabel}>{tool.title || tool.name}</span>}
          </>
        )

        return (
          <li key={tool.name}>
            {renderItem ? (
              renderItem({className: itemClassName, children, tool})
            ) : (
              <a className={itemClassName}>{children}</a>
            )}
          </li>
        )
      })}
    </ul>
  )
}

ToolList.defaultProps = {
  activeToolName: undefined,
  renderItem: undefined,
  showIcon: true,
  showLabel: true,
  tools: []
}

ToolList.propTypes = {
  activeToolName: PropTypes.string,
  renderItem: PropTypes.func,
  showIcon: PropTypes.bool,
  showLabel: PropTypes.bool,
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string,
      icon: PropTypes.func
    })
  )
}

export default ToolList
