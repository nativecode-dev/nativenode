import os from 'os'

import { fs } from '@nofrills/fs'
import { Lincoln } from '@nnode/lincoln'
import { DeepPartial } from 'ts-essentials'
import { Env, EnvCaseOptions } from '@nofrills/env'

import { Config } from './Config'
import { Merge } from '../utils/Merge'

export const ConfigType = Symbol('Config')

export const DefaultConfig: DeepPartial<Config> = {
  appname: 'sample',
}

export class Configuration<T extends Config> {
  private config: T

  private readonly env: DeepPartial<T>
  private readonly filepath: string
  private readonly rootpath: string
  private readonly log: Lincoln

  constructor(filename: string, config: DeepPartial<T>, logger: Lincoln) {
    this.log = logger.extend(filename)

    const options = { env: process.env, casing: EnvCaseOptions.LowerCase, prefix: config.appname }
    this.env = Env.from(options).toObject()

    this.config = Merge<T>([config, this.env])
    this.rootpath = fs.join(os.homedir(), '.config', this.config.appname)
    this.filepath = fs.join(this.rootpath, filename)
  }

  get filename(): string {
    return this.filepath
  }

  get value(): T {
    return this.config
  }

  async load() {
    try {
      const partial = this.config as DeepPartial<T>

      if (await fs.exists(this.filepath)) {
        const json = await fs.json<DeepPartial<T>>(this.filepath)
        this.config = Merge<T>([partial, json, this.env])
        this.log.trace('load-config', this.config)
      } else {
        this.config = Merge<T>([partial, this.env])
        this.log.trace('echo-config', this.config)
      }
    } catch (error) {
      console.error(error)
    }

    return this.config
  }

  async save() {
    try {
      if ((await fs.exists(this.rootpath)) === false) {
        await fs.mkdirp(this.rootpath, true)
      }

      return fs.writeFile(this.filename, JSON.stringify(this.config, null, 2))
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
