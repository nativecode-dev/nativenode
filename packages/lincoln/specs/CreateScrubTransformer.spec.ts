import 'mocha'

import expect from './expect'

import { createLogger } from '../src/CreateLogger'
import { createScrubTransformer } from '../src/Transformers/CreateScrubTransformer'

const lincoln = createLogger('lincoln:test')
lincoln.intercept(createScrubTransformer(['secret']))

describe('when using CreateScrubTransformer', () => {
  it('should protect access keys', (done) => {
    const subscription = lincoln.subscribe((envelope) => {
      expect(envelope.message.body.secret).to.equal('[SECRET]')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug({ secret: 'test' })
  })
})
