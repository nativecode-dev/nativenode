import 'mocha'

import fs from 'fs'

import { parse } from 'ini'

import expect from './expect'

import { createLogger } from '../src/CreateLogger'
import { LincolnMessageType } from '../src/LincolnMessageType'
import { createAwsTransformer } from '../src/Transformers/CreateAwsTransformer'

const lincoln = createLogger('lincoln:test')
lincoln.intercept(createAwsTransformer)

function getAccessKey(): string {
  if (process.env.PRIMARY_ACCESS_KEY) {
    return process.env.PRIMARY_ACCESS_KEY
  }

  if (process.env.AWS_ACCESS_KEY_ID) {
    return process.env.AWS_ACCESS_KEY_ID
  }

  if (process.env.HOME) {
    const buffer = fs.readFileSync(`${process.env.HOME}/.aws/credentials`)
    const credentials = parse(buffer.toString())
    return credentials.default.aws_access_key_id
  }

  throw new Error('could not find access key')
}

function getSecretKey(): string {
  if (process.env.PRIMARY_SECRET_KEY) {
    return process.env.PRIMARY_SECRET_KEY
  }

  if (process.env.AWS_SECRET_ACCESS_KEY) {
    return process.env.AWS_SECRET_ACCESS_KEY
  }

  if (process.env.HOME) {
    const buffer = fs.readFileSync(`${process.env.HOME}/.aws/credentials`)
    const credentials = parse(buffer.toString())
    return credentials.default.aws_secret_access_key
  }

  throw new Error('could not find secret key')
}

describe('when using CreateAwsTransformer', () => {
  it('should protect access keys', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.body).to.contain('[AWS_ACCESS_KEY_ID]')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug(getAccessKey())
  })

  it('should protect access keys in parameters', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.parameters).to.include('[AWS_ACCESS_KEY_ID]')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug('message', getAccessKey())
  })

  it('should protect secret keys', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.body).to.contain('[AWS_SECRET_ACCESS_KEY]')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug(getSecretKey())
  })

  it('should protect secret keys in parameters', done => {
    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.parameters).to.include('[AWS_SECRET_ACCESS_KEY]')
      subscription.unsubscribe()
      done()
    })

    lincoln.debug('message', getSecretKey())
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
