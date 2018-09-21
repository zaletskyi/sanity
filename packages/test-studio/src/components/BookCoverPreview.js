import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {combineLatest} from 'rxjs'
import {get} from 'lodash'
import {map} from 'rxjs/operators'
import client from 'part:@sanity/base/client'
import imageUrlBuilder from '@sanity/image-url'
import documentStore from 'part:@sanity/base/datastore/document'
import {observePaths} from 'part:@sanity/base/preview'
import Spinner from 'part:@sanity/components/loading/spinner'
import styles from './BookCoverPreview.css'

const urlBuilder = imageUrlBuilder(client)

export default class BookCoverPreview extends React.PureComponent {
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
      const snapshot = draftSnapshot || publishedSnapshot
      const prevSnapshot = this.state.document

      const prevAuthor = get(prevSnapshot, 'author._ref')
      const nextAuthor = get(snapshot, 'author._ref')

      this.setState({
        isLoading: false,
        document: snapshot,
        // eslint-disable-next-line react/no-access-state-in-setstate
        author: prevAuthor === nextAuthor ? this.state.author : null
      })

      if (prevAuthor !== nextAuthor) {
        if (this.authorListener$) {
          this.authorListener$.unsubscribe()
        }

        if (nextAuthor) {
          this.authorListener$ = observePaths(snapshot.author._ref, ['name']).subscribe(newAuthor =>
            this.setState({author: newAuthor})
          )
        }
      }
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
    const {isLoading, document, author} = this.state
    if (isLoading) {
      return <Spinner center message="Loading..." />
    }

    if (!document) {
      return <div>Document not found</div>
    }

    return (
      <div className={styles.root}>
        <div className={styles.cover}>
          {document.coverImage &&
            document.coverImage.asset && (
              <img
                src={urlBuilder
                  .image(document.coverImage)
                  .maxHeight(400)
                  .width(350)
                  .toString()}
              />
            )}
        </div>

        <h1 className={styles.title}>
          {document.title}
          {document.publicationYear ? ` (${document.publicationYear})` : ''}
        </h1>
        {author && <h2 className={styles.author}>by {author.name}</h2>}

        {document.synopsis && (
          <Fragment>
            <h3>Synopsis</h3>
            <div className={styles.synopsis}>
              {(document.synopsis || '').split('\n\n').map((text, i) => <p key={i}>{text}</p>)}
            </div>
          </Fragment>
        )}
      </div>
    )
  }
}
