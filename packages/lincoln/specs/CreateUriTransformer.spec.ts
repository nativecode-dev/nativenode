import 'mocha'

import expect from './expect'

import { createLogger } from '../src/CreateLogger'
import { createUriTransformer } from '../src/Transformers/CreateUriTransformer'

const lincoln = createLogger('lincoln:test')
lincoln.addTransform(createUriTransformer)

describe('when using CreateUriTransformer', () => {
  it('should protect URLS that contain a password', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.body).to.contain('[protected] http://example.com')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug('http://admin:password@example.com')
  })
})
