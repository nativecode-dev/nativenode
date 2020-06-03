import { fs } from '@nofrills/fs'
import { DeepPartial } from 'ts-essentials'

import { ConfigurationOptions } from './ConfigurationOptions'
import { MergeAll } from '../Utilities'

export const ConfigurationKey: symbol = Symbol('nativenode.common.Configuration')
export const ConfigurationPathKey: symbol = Symbol('nativenode.common.ConfigurationPath')
export const ConfigurationNameKey: symbol = Symbol('nativenode.common.ConfigurationName')

export class Configuration<T extends ConfigurationOptions> {
  private readonly configpath: string

  constructor(path: string = process.cwd(), name: string) {
    this.configpath = fs.join(path, name)
  }

  async load(options: DeepPartial<ConfigurationOptions> = {}): Promise<T> {
    if (await fs.exists(this.configpath)) {
      const json = await fs.json<T>(this.configpath)
      return MergeAll<T>(options, json as DeepPartial<T>)
    }

    return MergeAll<T>(options)
  }

  async save(configuration: T): Promise<void> {
    await fs.save(this.configpath, configuration)
  }
}
