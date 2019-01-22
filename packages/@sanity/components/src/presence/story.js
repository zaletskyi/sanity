import React from 'react'
import Menu from 'part:@sanity/components/menus/default'
import {storiesOf, action} from 'part:@sanity/storybook'
import {withKnobs, number, boolean, select} from 'part:@sanity/storybook/addons/knobs'
import Sanity from 'part:@sanity/storybook/addons/sanity'
import PresenceList from './PresenceList'
import {range} from 'lodash'
import Chance from 'chance'

const chance = new Chance()

const markers = range(20).map(marker => {
  return {
    type: 'presence',
    session: Math.random(),
    user: {
      displayName: chance.name(),
      identity: 'ppzqWGWNb',
      imageUrl: `https://placeimg.com/64/64/any?${Math.random()*1000}`
    }
  }
})

storiesOf('Presence')
  .addDecorator(withKnobs)
  .add('List', () => {
    return (
      <PresenceList markers={markers.slice(20 - number('Number of markers', 3, 'test')).reverse()} />
    )
  })
