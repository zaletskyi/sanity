import PropTypes from 'prop-types'
import React from 'react'
import {StateLink, withRouterHOC} from 'part:@sanity/base/router'
import styles from './styles/ToolSwitcher.css'
import PluginIcon from 'part:@sanity/base/plugin-icon'
import Ink from 'react-ink'
import {omit} from 'lodash'

function ToolSwitcher(props) {
  const {tools, router, activeToolName, onSwitchTool} = props
  return (
    <div className={`${styles.toolSwitcher} ${props.className}`}>
      <ul className={styles.toolList}>
        {tools.map(tool => {
          const itemClass = (activeToolName === tool.name)
            ? styles.activeItem
            : styles.item

          const ToolIcon = tool.icon || PluginIcon

          const nextState = {
            ...omit(router.state, router.state.tool), // clear current tool's state key
            tool: tool.name
          }
          return (
            <li key={tool.name} className={itemClass}>
              <StateLink className={styles.toolLink} state={nextState} onClick={onSwitchTool}>
                <div className={styles.iconContainer}>
                  <ToolIcon />
                </div>
                <div className={styles.toolName}>
                  {tool.title || tool.name}
                </div>
                <Ink duration={1000} opacity={0.10} radius={200} />
              </StateLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

ToolSwitcher.defaultProps = {
  className: ''
}

ToolSwitcher.propTypes = {
  activeToolName: PropTypes.string,
  onSwitchTool: PropTypes.func,
  className: PropTypes.string,
  router: PropTypes.shape({state: PropTypes.object}),
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.func
    })
  )
}

export default withRouterHOC(ToolSwitcher)