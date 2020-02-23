import 'mocha'

import expect from './expect'

import { MimeType } from '../src/Utilities/MimeType'

describe('when using MimeType', () => {
  it('should parse file', () => {
    expect(MimeType('text/html; charset=UTF-8')).to.deep.equal({ charset: 'UTF-8', media_type: 'text/html' })
  })
})
