import React from 'react'
import PropTypes from 'prop-types'
import {combineLatest} from 'rxjs'
import {map} from 'rxjs/operators'
import documentStore from 'part:@sanity/base/datastore/document'
import Spinner from 'part:@sanity/components/loading/spinner'

export default class JsonDocumentDump extends React.PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired
  }

  state = {isLoading: true}

  actionHandlers = {
    reload: () => this.setup()
  }

  setup() {
    this.dispose()
    this.setState({isLoading: true, document: undefined})

    const {itemId} = this.props
    const publishedId = itemId
    const draftId = `drafts.${publishedId}`

    const {draft, published} = documentStore.checkoutPair({publishedId, draftId})
    this.documentListener$ = combineLatest([
      draft.events.pipe(map(evt => evt.document)),
      published.events.pipe(map(evt => evt.document))
    ]).subscribe(([draftSnapshot, publishedSnapshot]) => {
      this.setState({isLoading: false, document: draftSnapshot || publishedSnapshot})
    })
  }

  dispose() {
    if (this.documentListener$) {
      this.documentListener$.unsubscribe()
    }
  }

  componentDidMount() {
    this.setup()
  }

  componentWillUnmount() {
    this.dispose()
  }

  render() {
    const {isLoading, document} = this.state
    if (isLoading) {
      return <Spinner center message="Loading..." />
    }

    if (!document) {
      return <div>Document not found</div>
    }

    return (
      <pre>
        <code>{JSON.stringify(document, null, 2)}</code>
      </pre>
    )
  }
}
