// @flow
import React from 'react'
import FormBuilder from './FormBuilder'
import schema from '../schema'
import toGradientPatch from '@sanity/form-builder/lib/sanity/utils/toGradientPatch'
import {Patcher} from '@sanity/mutator'

const VALUE = FormBuilder.createEmpty('blogpost')

function arrify(val) {
  if (Array.isArray(val)) {
    return val
  }
  return val === undefined ? [] : [val]
}

export default class Main extends React.Component {
  state = {
    value: VALUE
  }

  handleChange = event => {
    const gradientPatches = arrify(event.patch).map(toGradientPatch)

    const nextValue = gradientPatches
      .reduce(
        (acc, patch) => new Patcher(patch).applyViaAccessor(acc),
        this.state.value
      )

    this.setState({value: nextValue})
  }

  render() {
    const {value} = this.state
    return (
      <div>
        <h1>Main</h1>
        <FormBuilder type={schema.get('blogpost')} value={value} onChange={this.handleChange} />
      </div>
    )
  }
}
