import React from 'react'
import PropTypes from 'prop-types'
import {TransitionMotion, spring} from 'react-motion'
import colorHasher from './colorHasher'
import PresenceListItem from './PresenceListItem'
import styles from './styles/PresenceList.css'

function calcX(idx, len) {
  const distance = Math.min(Math.max(300 / len, 5), 20)
  return 0 - idx * distance
}

function filterMarkers(markers) {
  return markers.filter(marker => marker.type === 'presence')
}

export default class PresenceList extends React.PureComponent {
  static propTypes = {
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.shape({_key: PropTypes.string})
          ])
        ),
        type: PropTypes.string,
        identity: PropTypes.string,
        session: PropTypes.string
      })
    )
  }

  static defaultProps = {
    markers: []
  }

  willEnter = node => {
    const len = filterMarkers(this.props.markers).length
    const x = calcX(node.data.index, len) - 20
    return {
      x,
      opacity: 0,
      scale: 0.5
    }
  }

  willLeave = node => {
    const len = filterMarkers(this.props.markers).length
    const x = calcX(node.data.index, len) - 20
    return {
      x: spring(x, {stiffness: 400}),
      opacity: spring(0, {stiffness: 500}),
      scale: spring(0.5)
    }
  }

  render() {
    const markers = filterMarkers(this.props.markers)
    const len = markers.length

    if (len < 1) {
      return null
    }

    return (
      <TransitionMotion
        styles={markers.map((marker, idx) => {
          const index = len - idx - 1
          return {
            key: marker.session,
            data: {
              marker,
              index
            },
            style: {
              x: spring(calcX(index, len), {damping: 15, stiffness: 400}),
              opacity: spring(1, {damping: 30, stiffness: 400}),
              scale: spring(1)
            }
          }
        })}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles => (
          <div className={styles.root}>
            {interpolatedStyles.map(({data, key, style}) => {
              const {index, marker} = data
              return (
                <div
                  className={styles.item}
                  key={key}
                  style={{
                    opacity: style.opacity,
                    transform: [`translate3d(${style.x}px, 0, 0)`, `scale(${style.scale})`].join(
                      ''
                    ),
                    zIndex: index + 1
                  }}
                >
                  <PresenceListItem user={marker.user} color={colorHasher(marker.identity)} />
                </div>
              )
            })}
          </div>
        )}
      </TransitionMotion>
    )
  }
}
