import {uniq, keyBy} from 'lodash'

function uniqueMatches(matcher, text) {
  const matches = (text.match(matcher) || []).map(match => match.toLowerCase())
  return uniq(matches).length
}

// takes a set of terms and a value and returns a score value between 0, 1
const calculateFieldScore = (terms, fieldValue) => {
  const termsRegExp = terms.map(term => `\\b${term}`).join('|')
  const matcher = new RegExp(`(${termsRegExp})`, 'gi')
  const uniqMatchCount = uniqueMatches(matcher, fieldValue)
  const fieldScore = uniqMatchCount / terms.length
  return fieldScore === 1 ? 2 : fieldScore // boost exact match
}

const stringify = value => (typeof value === 'string' ? value : JSON.stringify(value))

export function applyWeights(searchSpec, hits, terms = []) {
  const byType = keyBy(searchSpec, spec => spec.typeName)
  return hits.map((hit, index) => {
    const typeSpec = byType[hit._type]
    const score = typeSpec.paths.reduce((total, pathSpec, idx) => {
      const value = stringify(hit[`w${idx}`])
      return total + (value ? calculateFieldScore(terms, value) * pathSpec.weight : 0)
    }, 0)

    return {hit, resultIndex: hits.length - index, score}
  })
}
