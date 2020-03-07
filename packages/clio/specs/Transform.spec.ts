import 'mocha'

import expect from './expect'

import { timestamp } from '../src/Transformers/Timestamp'
import { transform } from '../src/Functions/Transform'
import { ClioOptions } from '../src/ClioOptions'

describe('when using the transform function', () => {
  const options: ClioOptions = {
    format: {
      includeTimestamp: true,
      timestampFormat: '[{date]] {line}',
    },
    transfomers: [timestamp],
  }

  it('should add timestamp to all lines', () => {
    const transformed = transform('test', options)
    expect(transformed.join('').startsWith('[')).to.be.true
  })
})
