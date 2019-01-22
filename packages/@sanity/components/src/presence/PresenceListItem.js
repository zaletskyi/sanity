/* eslint-disable complexity */
import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'react-tippy'
import styles from './styles/PresenceListItem.css'
import colorHasher from './colorHasher'

export default class PresenceListItem extends React.PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      identity: PropTypes.string,
      imageUrl: PropTypes.string,
      displayName: PropTypes.string
    }).isRequired
  }

  render() {
    const {user} = this.props
    const imgUrl = user.imageUrl || user.profileImage
    const userColor = colorHasher(user.identity)
    const imgStyles = {
      display: 'block',
      borderColor: userColor,
      backgroundColor: userColor,
      backgroundImage: imgUrl && `url(${imgUrl})`
    }

    return (
      <Tooltip
        title={user.displayName || 'Loading...'}
        position="top"
        trigger="mouseenter"
        animation="scale"
        arrow
        theme="light"
        distance="10"
        duration={50}
        className={styles.root}
        style={imgStyles}
      />
    )
  }
}
