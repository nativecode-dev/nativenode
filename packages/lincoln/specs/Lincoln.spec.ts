import 'mocha'

import expect from './expect'

import { Lincoln } from '../src/Lincoln'
import { createMessage } from '../src/Functions/CreateMessage'
import { LincolnMessageType } from '../src/Interfaces/LincolnMessageType'

describe('when using Lincoln', () => {
  it('should create instance', () => {
    const sut = new Lincoln({ namespace: 'lincoln:test' })
    expect(sut.scope).to.be.equal('lincoln:test')
    sut.close()
  })

  it('should extend existing Lincoln instance', () => {
    const lincoln = new Lincoln({ namespace: 'lincoln:test' })
    const sut = lincoln.extend('extended')
    expect(sut.scope).to.equal('lincoln:test:extended')
    sut.close()
    lincoln.close()
  })

  it('should observe single messages', done => {
    const sut = new Lincoln({ namespace: 'lincoln:test' })

    const subscription = sut.subscribe(envelope => {
      expect(envelope.message.body).to.equal('test')
      subscription.unsubscribe()
      sut.close()
      done()
    })

    sut.write(createMessage('test', LincolnMessageType.info))
  })

  it('should observe extended messages', done => {
    const lincoln = new Lincoln({ namespace: 'lincoln:test' })
    const sut = lincoln.extend('extended')

    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.body).to.equal('test')
      subscription.unsubscribe()
      sut.close()
      done()
    })

    sut.write(createMessage('test', LincolnMessageType.info))
  })

  const sut = new Lincoln({ namespace: 'lincoln:test' })

  after(() => sut.close())

  describe('to call log methods', () => {
    it('should log debug message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.equal('debug message')
        subscription.unsubscribe()
        done()
      })

      sut.debug('debug message')
    })

    it('should log info message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.equal('info message')
        subscription.unsubscribe()
        done()
      })

      sut.info('info message')
    })

    it('should log warn message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.equal('warn message')
        subscription.unsubscribe()
        done()
      })

      sut.warn('warn message')
    })

    it('should log silly message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.equal('silly message')
        subscription.unsubscribe()
        done()
      })

      sut.silly('silly message')
    })

    it('should log trace message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.equal('trace message')
        subscription.unsubscribe()
        done()
      })

      sut.trace('trace message')
    })

    it('should log fatal message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.instanceOf(Error)
        subscription.unsubscribe()
        done()
      })

      sut.fatal(new Error('fatal'))
    })

    it('should log error message', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.instanceOf(Error)
        subscription.unsubscribe()
        done()
      })

      sut.error(new Error('error'))
    })

    it('should log message with parameters', done => {
      const subscription = sut.subscribe(envelope => {
        expect(envelope.scope).to.equal('lincoln:test')
        expect(envelope.message.body).to.equal('message')
        expect(envelope.message.parameters).to.deep.equal([1, 2, 3])
        subscription.unsubscribe()
        done()
      })

      sut.write({ body: 'message', parameters: [1, 2, 3], type: LincolnMessageType.debug })
    })
  })
})
