/* eslint-disable complexity */
import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'react-tippy'
import styles from './styles/PresenceListItem.css'

export default class PresenceListItem extends React.PureComponent {
  static propTypes = {
    color: PropTypes.string,
    user: PropTypes.shape({
      identity: PropTypes.string,
      imageUrl: PropTypes.string,
      displayName: PropTypes.string
    })
  }

  render() {
    const {user, color} = this.props

    const imgStyles = {
      display: 'block',
      backgroundColor: color,
      borderColor: color,
      backgroundImage: user && user.imageUrl && `url(${user.imageUrl})`
    }

    const initials = (user && user.displayName.match(/\b\w/g).join('')) || '?'

    return (
      <Tooltip
        title={(user && user.displayName) || 'Unknown user'}
        position="top"
        trigger="mouseenter"
        animation="scale"
        arrow
        theme="light"
        distance="10"
        duration={50}
        className={user && user.imageUrl ? styles.root : styles.noImage}
        style={imgStyles}
      >
        {user && user.imageUrl ? '' : <span className={styles.initials}>{initials}</span>}
      </Tooltip>
    )
  }
}
