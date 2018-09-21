import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import client from 'part:@sanity/base/client'
import imageUrlBuilder from '@sanity/image-url'
import WithSnapshot from 'part:@sanity/base/with-snapshot'
import Spinner from 'part:@sanity/components/loading/spinner'
import styles from './BookCoverPreview.css'

const urlBuilder = imageUrlBuilder(client)

export default class BookCoverPreview extends React.PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired
  }

  state = {darkMode: false}

  actionHandlers = {
    toggleDarkMode: () => this.setState(prevState => ({darkMode: !prevState.darkMode}))
  }

  render() {
    return (
      <WithSnapshot documentId={this.props.itemId}>
        {({isLoading, snapshot}) => {
          if (isLoading) {
            return <Spinner center message="Loading..." />
          }

          if (!snapshot) {
            return <div>Document not found</div>
          }

          return (
            <div className={this.state.darkMode ? styles.rootDarkMode : styles.root}>
              <div className={styles.cover}>
                {snapshot.coverImage &&
                  snapshot.coverImage.asset && (
                    <img
                      src={urlBuilder
                        .image(snapshot.coverImage)
                        .maxHeight(400)
                        .width(350)
                        .toString()}
                    />
                  )}
              </div>

              <h1 className={styles.title}>
                {snapshot.title}
                {snapshot.publicationYear ? ` (${snapshot.publicationYear})` : ''}
              </h1>

              {snapshot.synopsis && (
                <Fragment>
                  <h3>Synopsis</h3>
                  <div className={styles.synopsis}>
                    {(snapshot.synopsis || '')
                      .split('\n\n')
                      .map((text, i) => <p key={i}>{text}</p>)}
                  </div>
                </Fragment>
              )}
            </div>
          )
        }}
      </WithSnapshot>
    )
  }
}
