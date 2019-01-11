import {fieldNeedsEscape, escapeField, joinPath} from '../src/util/searchUtils'

test('weighting', () => {
  expect(fieldNeedsEscape('0foo')).toBe(true)
  expect(fieldNeedsEscape('foo bar')).toBe(true)
  expect(fieldNeedsEscape('0')).toBe(true)

  expect(fieldNeedsEscape('foobar')).toBe(false)
  expect(fieldNeedsEscape('foobar123')).toBe(false)

  // Keywords
  ;[('match', 'in', 'asc', 'desc', 'true', 'false', 'null')].forEach(kw => {
    expect(fieldNeedsEscape(kw)).toBe(true)
  })
})
