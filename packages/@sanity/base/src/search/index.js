import client from 'part:@sanity/base/client?'
import schema from 'part:@sanity/base/schema'
import {getSearchableTypes} from './common/utils'
import {createWeightedSearch} from './weighted/createWeightedSearch'

export default createWeightedSearch(
  getSearchableTypes(schema), //.filter(t => t.name === 'species' || t.name === 'focusTest'),
  client
)
