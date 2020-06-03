import { fs } from '@nofrills/fs'
import { Merge, DeepPartial } from '@nnode/common'

import { ConfigurationOptions } from './ConfigurationOptions'

export class Configuration<T extends ConfigurationOptions> {
  private readonly configpath: string

  constructor(path: string = process.cwd(), name: string) {
    this.configpath = fs.join(path, name)
  }

  async load(options: DeepPartial<ConfigurationOptions> = {}): Promise<T> {
    if (await fs.exists(this.configpath)) {
      const buffer = await fs.json<T>(this.configpath)
      return Merge<T>(options, buffer)
    }

    return Merge<T>(options)
  }

  async save(configuration: T): Promise<void> {
    await fs.save(this.configpath, configuration)
  }
}
