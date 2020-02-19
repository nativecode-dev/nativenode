import 'mocha'

import expect from './expect'

import { createLogger } from '../src/CreateLogger'
import { LincolnMessageType } from '../src/LincolnMessageType'
import { createUriTransformer } from '../src/Transformers/CreateUriTransformer'

const lincoln = createLogger('lincoln:test')
lincoln.intercept(createUriTransformer)

describe('when using CreateUriTransformer', () => {
  it('should protect URLS that contain a password', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.body).to.contain('http://[protected]@example.com')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug('http://admin:password@example.com')
  })

  it('should protect URLS that contain a password in parameters', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.parameters).to.include('http://[protected]@example.com')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug('message', 'http://admin:password@example.com')
  })

  it('should log message with parameters', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.scope).to.equal('lincoln:test')
      expect(envelope.message.body).to.equal('message')
      expect(envelope.message.parameters).to.deep.equal([1, 2, 3])
      subscription.unsubscribe()
      done()
    })

    lincoln.write({ body: 'message', parameters: [1, 2, 3], type: LincolnMessageType.debug })
  })
})
