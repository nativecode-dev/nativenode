import { DeepPartial } from 'ts-essentials'

import { expect } from './helpers'
import { Config } from '../src/config/Config'
import { Configuration, DefaultConfig } from '../src/config/Configuration'
import { createLogger } from '@nnode/lincoln'

interface TestConfig extends Config {
  array: string[]
  name: string
}

const DefaultTestConfig: DeepPartial<TestConfig> = {
  ...DefaultConfig,
  array: ['string'],
  name: 'name',
}

describe('when using Configuration', () => {
  it('should load default config', async () => {
    const loader = new Configuration<TestConfig>('.sosus-test.json', DefaultTestConfig, createLogger('test'))
    const config = await loader.load()
    expect(config.array).to.deep.equal(['string'])
  })
})
