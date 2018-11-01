import PropTypes from 'prop-types'
import React from 'react'
import {StateLink, withRouterHOC} from 'part:@sanity/base/router'
import ToolSwitcher from './ToolSwitcher'

class ToolSwitcherContainer extends React.PureComponent {
  static propTypes = {
    onSwitchTool: PropTypes.func.isRequired,
    router: PropTypes.shape({state: PropTypes.object}).isRequired,
    showLabel: PropTypes.bool.isRequired
  }

  renderItem = ({children, className, tool}) => {
    const {onSwitchTool} = this.props
    return (
      <StateLink state={tool.state} className={className} onClick={onSwitchTool}>
        {children}
      </StateLink>
    )
  }

  setInstance = instance => {
    this.instance = instance
  }

  render() {
    const {router, showLabel} = this.props
    const activeToolName = router.state.tool
    const tools = this.props.tools.map(tool => {
      return {
        state: router && Object.assign({}, router.state, {tool: tool.name}),
        ...tool
      }
    })

    return (
      <ToolSwitcher
        {...this.props}
        activeToolName={activeToolName}
        renderItem={this.renderItem}
        showLabel={showLabel}
        tools={tools}
      />
    )
  }
}

export default withRouterHOC(ToolSwitcherContainer)
