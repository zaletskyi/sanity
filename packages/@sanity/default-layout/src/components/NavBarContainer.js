import config from 'config:sanity'
import {StateLink, withRouterHOC} from 'part:@sanity/base/router'
import PropTypes from 'prop-types'
import React from 'react'
import Branding from './Branding'
import NavBar from './NavBar'
import SearchContainer from './SearchContainer'
import ToolSwitcherContainer from './ToolSwitcherContainer'

import styles from './styles/NavBar.css'

/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable no-lonely-if */
function getNextState(state, mostRight, viewportWidth) {
  const {showLabel, showLabelMinWidth, showToolSwitcher, showToolSwitcherMinWidth} = state
  const mostRightIsVisible = mostRight && mostRight <= viewportWidth
  const nextState = {}

  let didChange = false

  if (mostRightIsVisible) {
    // most-right element is within viewport
    if (showLabel) {
      if (showLabelMinWidth === -1 || viewportWidth < showLabelMinWidth) {
        nextState.showLabelMinWidth = viewportWidth
        didChange = true
      }
    } else if (showLabelMinWidth < viewportWidth) {
      nextState.showLabel = true
      didChange = true
    }

    if (showToolSwitcher) {
      if (showToolSwitcherMinWidth === -1 || viewportWidth < showToolSwitcherMinWidth) {
        nextState.showToolSwitcherMinWidth = viewportWidth
        didChange = true
      }
    } else if (showToolSwitcherMinWidth < viewportWidth) {
      nextState.showToolSwitcher = true
      didChange = true
    }
  } else {
    // most-right element is NOT within viewport
    if (showLabel) {
      nextState.showLabel = false
      didChange = true
    } else if (showToolSwitcher) {
      nextState.showToolSwitcher = false
      didChange = true
    }
  }

  return didChange ? nextState : null
}
/* eslint-enable complexity */
/* eslint-enable max-depth */
/* eslint-enable no-lonely-if */

class NavBarContainer extends React.PureComponent {
  static propTypes = {
    onSwitchTool: PropTypes.func.isRequired,
    router: PropTypes.shape({
      state: PropTypes.shape({tool: PropTypes.string}),
      navigate: PropTypes.func
    }).isRequired,
    tools: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    ).isRequired
  }

  state = {
    showLabel: false,
    showLabelMinWidth: -1,
    showToolSwitcher: false,
    showToolSwitcherMinWidth: -1
  }

  rootElement = null
  loginStatusElement = null

  componentDidMount() {
    // Setup IntersectionObserver to check whether elements within the NavBar
    // exits the viewport at any time.
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  }

  /* eslint-disable complexity */
  componentDidUpdate(prevProps, prevState) {
    const {showLabel, showLabelMinWidth, showToolSwitcher, showToolSwitcherMinWidth} = this.state
    const didShowLabel = showLabelMinWidth === -1 && !prevState.showLabel && showLabel
    const didShowToolSwitcher =
      showToolSwitcherMinWidth === -1 && !prevState.showToolSwitcher && showToolSwitcher
    const didHideLabel = showToolSwitcherMinWidth === -1 && prevState.showLabel && !showLabel

    if (didShowLabel || didShowToolSwitcher || didHideLabel) {
      this.handleWindowResize()
    }
  }
  /* eslint-enable complexity */

  componentWillUnmount() {
    if (this.io) {
      this.io.disconnect()
      this.io = null
    }
  }

  handleWindowResize = () => {
    if (this.loginStatusElement) {
      const rect = this.loginStatusElement.getBoundingClientRect()
      const nextState = getNextState(this.state, rect.left + rect.width, window.innerWidth)

      if (nextState) {
        // console.log(nextState)
        this.setState(nextState)
      }
    }
  }
  handleSetRootElement = element => {
    this.rootElement = element
  }

  handleSetLoginStatusElement = element => {
    this.loginStatusElement = element
  }

  render() {
    const {
      onSetToolSwitcherElement,
      onSearchClose,
      onSearchOpen,
      onSwitchTool,
      router,
      searchIsOpen,
      tools
    } = this.props

    const {showLabel, showToolSwitcher} = this.state

    const containers = {
      branding: (
        <StateLink toIndex className={styles.brandingLink}>
          <Branding projectName={config && config.projectName} />
        </StateLink>
      ),
      toolBar: (
        <ToolSwitcherContainer
          onSetElement={onSetToolSwitcherElement}
          onSwitchTool={onSwitchTool}
          router={router}
          showLabel={showLabel}
          tools={tools}
        />
      ),
      search: (
        <SearchContainer
          shouldBeFocused={searchIsOpen}
          onOpen={onSearchOpen}
          onClose={onSearchClose}
        />
      )
    }

    return (
      <NavBar
        {...this.props}
        {...containers}
        onSetRootElement={this.handleSetRootElement}
        onSetLoginStatusElement={this.handleSetLoginStatusElement}
        showToolSwitcher={showToolSwitcher}
      />
    )
  }
}

export default withRouterHOC(NavBarContainer)
