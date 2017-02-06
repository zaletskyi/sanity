import Schema from '@sanity/schema'

export default Schema.compile({
  name: 'blocks-example',
  types: [
    {
      name: 'blogpost',
      type: 'object',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Title'
        },
        {
          name: 'content',
          type: 'array',
          title: 'Content',
          of: [
            {
              title: 'String',
              type: 'string',
            }
          ]
        }
      ]
    }
  ]
})
