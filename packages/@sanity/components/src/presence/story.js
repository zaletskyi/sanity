import React from 'react'
import {storiesOf, action} from 'part:@sanity/storybook'
import {withKnobs, text, number, boolean} from 'part:@sanity/storybook/addons/knobs'
// import Sanity from 'part:@sanity/storybook/addons/sanity'
import PresenceList from './PresenceList'
import {range} from 'lodash'
import Chance from 'chance'
import colorHasher from './colorHasher'
const chance = new Chance()



const markers = range(40).map(marker => {
  return {
    type: 'presence',
    identity: chance.geohash({length: 9}),
    session: chance.guid(),
    color: chance.color(),
    user: {
      displayName: chance.name(),
      imageUrl: `https://placeimg.com/64/64/any?${Math.random()*1000}`
    }
  }
})

storiesOf('Presence')
  .addDecorator(withKnobs)
  .add('List', () => {
    const showImage = boolean('show image', true, 'test')
    const newMarkers = markers.map(marker => {
      return {
        ...marker,
        user: {
          ...marker.user,
          imageUrl: showImage ? marker.user.imageUrl : undefined
        }
      }
    })
    return (
      <div style={{padding: '2em', backgroundColor: '#ccc', position: 'relative'}}>
        <PresenceList
          markers={newMarkers.slice(newMarkers.length - number('Number of markers', 3, 'test'))}
        />
      </div>
    )
  })
  .add('colorHasher', () => {
    const color = colorHasher(text('string'))
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: color
        }}
      />
    )
  })
