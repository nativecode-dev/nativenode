import { DeepPartial } from 'ts-essentials'
import { createLogger } from '@nnode/lincoln'

import { expect } from './helpers'
import { AppConfig } from '../src/config/AppConfig'
import { Configuration, DefaultConfig } from '../src/config/Configuration'

interface TestConfig extends AppConfig {
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
