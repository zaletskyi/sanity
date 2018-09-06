/* eslint-disable complexity */
import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@sanity/components/menus/default-style'
import Ink from 'react-ink'
import enhanceWithClickOutside from 'react-click-outside'
import classNames from 'classnames'

class DefaultMenu extends React.PureComponent {
  static propTypes = {
    onAction: PropTypes.func.isRequired,
    ripple: PropTypes.bool,
    className: PropTypes.string,
    onClickOutside: PropTypes.func,
    onClose: PropTypes.func,
    renderItem: PropTypes.func,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.node.isRequired,
        icon: PropTypes.func
      })
    )
  }

  lastWindowHeight = 0
  scrollOffset = 0

  static defaultProps = {
    ripple: true,
    onClickOutside() {},
    onClose() {},
    renderItem(item, index) {
      const Icon = item.icon
      return (
        <div className={item.danger ? styles.dangerLink : styles.link}>
          {Icon && (
            <span className={styles.iconContainer}>
              <Icon className={styles.icon} />
            </span>
          )}
          {item.title}
          {!item.isDisabled && <Ink duration={200} opacity={0.1} radius={200} />}
        </div>
      )
    }
  }

  state = {
    focusedItem: this.props.items[0]
  }

  handleClickOutside = event => {
    this.props.onClickOutside(event)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown, false)
    window.addEventListener('resize', this.handleResize, false)
    this.handleFocus()
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, false)
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleKeyDown = event => {
    const {items} = this.props
    const {focusedItem} = this.state
    const currentIndex = items.indexOf(focusedItem) || 0

    if (event.key == 'Escape') {
      this.props.onClose()
    }

    if (event.key == 'ArrowDown' && currentIndex < items.length - 1) {
      this.setState({
        focusedItem: this.props.items[currentIndex + 1]
      })
    }

    if (event.key == 'ArrowUp' && currentIndex > 0) {
      this.setState({
        focusedItem: this.props.items[currentIndex - 1]
      })
    }

    if (event.key == 'Enter' && this.state.selectedItem) {
      this.props.onAction(this.props.items[currentIndex])
    }
    event.preventDefault() // disables scroll on arrows
  }

  handleItemClick = event => {
    const actionId = event.currentTarget.getAttribute('data-action-id')
    this.props.onAction(this.props.items[actionId])
  }

  handleFocus = event => {
    const index = event && event.target.getAttribute('data-action-id')
    this.setState({
      focusedItem: this.props.items[index || 0]
    })
  }

  handleKeyPress = event => {
    const index = event.target.getAttribute('data-action-id')
    if (event.key === 'Enter') {
      console.log('Enter')
      this.props.onAction(this.props.items[index])
    }
  }

  setRootElement = element => {
    this._rootElement = element
  }

  render() {
    const {focusedItem} = this.state
    const {items, renderItem, className} = this.props
    return (
      <div ref={this.setRootElement} className={`${styles.root} ${className || ''}`}>
        <ul className={styles.list}>
          {items.map((item, i) => {
            return (
              <li
                key={i}
                onClick={item.isDisabled ? null : this.handleItemClick}
                data-action-id={i}
                onFocus={this.handleFocus}
                tabIndex="0"
                onKeyPress={this.handleKeyPress}
                className={classNames([
                  item === focusedItem ? styles.focusedItem : styles.item,
                  item.isDisabled && styles.isDisabled,
                  item.divider && styles.divider
                ])}
              >
                {renderItem(item, i)}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default enhanceWithClickOutside(DefaultMenu)
