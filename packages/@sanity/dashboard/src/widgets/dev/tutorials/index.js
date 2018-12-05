// @implements :@sanity/dashboard/widget

import React from 'react'
import TutorialsWidget from './components/TutorialsWidget'

function Root() {
  return <TutorialsWidget />
}

export default {
  name: 'dev/tutorials',
  component: Root
}
