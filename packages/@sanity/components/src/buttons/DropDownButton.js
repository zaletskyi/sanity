/* eslint-disable complexity */
import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@sanity/components/buttons/dropdown-style'
import Button from 'part:@sanity/components/buttons/default'
import ArrowIcon from 'part:@sanity/base/angle-down-icon'
import {List, Item} from 'part:@sanity/components/lists/default'
import {omit, get} from 'lodash'
import Poppable from 'part:@sanity/components/utilities/poppable'
// import ArrowKeyNavigation from 'part:@sanity/components/utilities/arrow-key-navigation'
import ArrowKeyNavigation from 'boundless-arrow-key-navigation/build'

export default class DropDownButton extends React.PureComponent {
  static propTypes = {
    kind: PropTypes.oneOf(['secondary', 'add', 'delete', 'warning', 'success', 'danger', 'simple']),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.func
      })
    ),
    onAction: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    inverted: PropTypes.bool,
    icon: PropTypes.func,
    loading: PropTypes.bool,
    ripple: PropTypes.bool,
    colored: PropTypes.bool,
    color: PropTypes.string,
    className: PropTypes.string,
    remderItem: PropTypes.func
  }

  static defaultProps = {
    renderItem(item) {
      return <div>{item.title}</div>
    }
  }

  state = {
    menuOpened: false
  }

  handleClose = () => {
    this.setState({menuOpened: false})
  }

  setMenuElement = element => {
    this._menuElement = element
  }

  handleOnClick = event => {
    this.setState({
      menuOpened: true,
      width: event.target.offsetWidth
    })
    if (
      event.key == 'ArrowDown' &&
      this.state.menuOpened &&
      this._popperElement &&
      this._popperElement.focus
    ) {
      this._popperElement.focus()
    }
  }

  handleClickOutside = event => {
    if (this._rootElement && this._rootElement.contains(event.target)) {
      // Stop the open button from being clicked
      event.stopPropagation()
      this.handleClose()
    } else {
      this.handleClose()
    }
  }

  handleAction = item => {
    this.props.onAction(item)
    this.handleClose()
  }

  setPopperElement = element => {
    this._popperElement = element
  }

  handleMenuAction = item => {
    const {onAction} = this.props
    onAction(item)
  }

  handleButtonKeyDown = event => {
    if (
      event.key == 'ArrowDown' &&
      this.state.menuOpened &&
      this._popperElement &&
      this._popperElement.focus
    ) {
      this._popperElement.focus()
    }
  }

  render() {
    const {items, renderItem, children, kind, className, ...rest} = omit(this.props, 'onAction')
    const {menuOpened, width} = this.state

    const modifiers = {
      preventOverflow: 'viewport',
      customStyle: {
        enabled: true,
        fn: data => {
          data.styles = {
            ...data.styles,
            minWidth: get(data, 'offsets.width' || 100)
          }
          return data
        }
      }
    }

    const target = (
      <Button
        {...rest}
        onClick={this.handleOnClick}
        kind={kind}
        onKeyDown={this.handleButtonKeyDown}
      >
        <span className={styles.title}>{children}</span>
        <span className={styles.arrow}>
          <ArrowIcon color="inherit" />
        </span>
      </Button>
    )

    return (
      <div className={`${styles.root} ${className}`}>
        <Poppable
          modifiers={modifiers}
          target={target}
          onEscape={this.handleClose}
          onClickOutside={this.handleClose}
        >
          {menuOpened && (
            <div
              className={styles.popper}
              style={{minWidth: `${width}px`}}
              ref={this.setPopperElement}
              tabIndex="0"
            >
              {/* component list causes error here */}
              <ArrowKeyNavigation> 
                {items.map((item, i) => {
                  return (
                    <Item
                      key={i}
                      className={styles.listItem}
                      onKeyPress={() => this.handleMenuAction(item)}
                      item={item}
                    >
                      {renderItem(item)}
                    </Item>
                  )
                })}
              </ArrowKeyNavigation>
            </div>
          )}
        </Poppable>
      </div>
    )
  }
}
