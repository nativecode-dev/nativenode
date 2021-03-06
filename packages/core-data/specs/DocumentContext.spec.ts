import 'reflect-metadata'

import { Throttle } from '@nnode/core'

import { expect } from './helpers'
import { DefaultTestContextConfig, TestContext } from './helpers/TestContext'
import { createLogger } from '@nnode/lincoln'

describe('when using DocumentContext', () => {
  const context = new TestContext(DefaultTestContextConfig, createLogger('test'))

  before(async () => {
    await context.initialize()
  })

  it('should save environment', async () => {
    const environments = await context.variables.count()
    const users = await context.users.count()
    expect(environments + users).to.equal(0)
  })

  it('should save user', async () => {
    const user = context.users.createDocument({ home: '/home/test', username: 'test', _id: 'test' })
    expect(context.users.update(user)).to.eventually.be.fulfilled
  })

  it('should delete user', async () => {
    const user = await context.users.byId('test')
    const response = await context.users.delete(user._id, user._rev)
    expect(response.ok).to.be.true
  })

  it('should bulk create documents', async () => {
    const created = Object.keys(process.env).map((key) =>
      context.variables.createDocument({ name: key, value: process.env[key] }),
    )
    const environments = await context.variables.bulk(created)
    const documents = await Throttle(environments.map((env) => () => context.variables.byId(env.id!)))
    expect(documents.length).to.equal(Object.keys(process.env).length)
  })

  it('should delete environments', async () => {
    const documents = await context.variables.all()
    await Throttle(documents.map((document) => () => context.variables.delete(document._id, document._rev)))
    const count = await context.variables.count()
    expect(count).to.equal(0)
  })
})
