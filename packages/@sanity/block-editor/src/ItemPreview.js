import React, {PropTypes} from 'react'
import {Preview} from '@sanity/form-builder'

export default class ItemPreview extends React.Component {

  static propTypes = {
    type: PropTypes.object.isRequired,
    value: PropTypes.any
  };

  render() {
    const {value, type} = this.props

    return (
      <Preview
        layout="default"
        value={value.serialize()}
        type={type}
      />
    )
  }
}
