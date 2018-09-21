import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import RefreshIcon from 'part:@sanity/base/sync-icon'
import JsonDocumentDump from './components/JsonDocumentDump'
import BookCoverPreview from './components/BookCoverPreview'

// For testing. Bump the timeout to introduce som lag
const delay = val => new Promise(resolve => setTimeout(resolve, 10, val))

export default () =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentListItem()
        .id('asoiaf-asos')
        .schemaType('book')
        .title('A Storm of Swords')
        .child([
          // Edit the book
          S.editor()
            .id('editor')
            .documentId('asoiaf-asos')
            .schemaType('book'),

          // Preview the book
          S.component()
            .component(BookCoverPreview)
            .title('Preview')
            .menuItems([
              S.menuItem()
                .title('Toggle Dark Mode')
                .action('toggleDarkMode')
                .icon(RefreshIcon)
                .showAsAction(true)
            ])
        ]),

      S.listItem()
        .title('Anything with a title')
        .icon(() => <span style={{fontSize: '2em'}}>T</span>)
        .child(() =>
          delay(
            S.documentList({
              id: 'title-list',
              title: 'Titles!',
              options: {
                filter: 'defined(title)'
              }
            })
          )
        ),

      S.listItem()
        .title('Singleton?')
        .child(delay(S.editor({id: 'editor', options: {id: 'circular', type: 'referenceTest'}}))),

      ...S.documentTypeListItems()
    ])
