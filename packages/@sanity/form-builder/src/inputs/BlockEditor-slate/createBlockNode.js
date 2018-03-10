import React from 'react'
import FormBuilderBlock from './FormBuilderBlock'

export default function createBlockNode(type, onFocus) {
  return function BlockNode(props) {
    return <FormBuilderBlock type={type} {...props} onFocus={onFocus} />
  }
}
