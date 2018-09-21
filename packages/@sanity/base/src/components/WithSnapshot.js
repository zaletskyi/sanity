import React from 'react'
import PropTypes from 'prop-types'
import {combineLatest} from 'rxjs'
import documentStore from 'part:@sanity/base/datastore/document'
import {map} from 'rxjs/operators'

export default class WithSnapshot extends React.PureComponent {
  static propTypes = {
    documentId: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.setup()
  }

  setup() {
    this.dispose()
    this.setState({isLoading: true, document: undefined})

    const publishedId = this.props.documentId
    const draftId = `drafts.${publishedId}`

    let isSync = true
    const {draft, published} = documentStore.checkoutPair({publishedId, draftId})
    this.snapshotListener$ = combineLatest([
      draft.events.pipe(map(evt => evt.document)),
      published.events.pipe(map(evt => evt.document))
    ]).subscribe(([draftSnapshot, publishedSnapshot]) => {
      const newState = {
        isLoading: false,
        snapshot: draftSnapshot || publishedSnapshot
      }

      if (isSync) {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state = newState
      } else {
        this.setState(newState)
      }
    })
    isSync = false
  }

  dispose() {
    if (this.snapshotListener$) {
      this.snapshotListener$.unsubscribe()
    }
  }

  componentWillUnmount() {
    this.dispose()
  }

  render() {
    return this.props.children(this.state)
  }
}
