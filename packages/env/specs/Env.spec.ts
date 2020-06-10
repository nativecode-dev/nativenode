import 'mocha'

import expect from './index'

import { Env } from '../src/Env'
import { EnvCaseOptions } from '../src/EnvCaseOptions'

const ENV = {
  APP_TEST: 'value',
}

describe('when using Env', () => {
  it('should create object from env variables', () => {
    const env = new Env({ env: ENV, prefix: 'app' })
    expect(env.toObject().app.test).to.equal('value')
  })

  it('should create object from env variables with pascal casing', () => {
    const env = new Env({ casing: EnvCaseOptions.capitalize, env: ENV, prefix: 'app' })
    expect(env.toObject().App.Test).to.equal('value')
  })

  it('should export variables', () => {
    const env = new Env({ env: ENV, prefix: 'app' })
    const obj = env.toVariables()
    expect(obj.APP_TEST).to.equal('value')
  })
})
