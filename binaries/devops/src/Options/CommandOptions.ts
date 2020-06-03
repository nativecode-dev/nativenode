import { Options } from 'yargs'

import { ConfigOptions } from './ConfigOptions'

export interface CommandOptions extends ConfigOptions, Options {
  command: string
  configuration: string
  options: string[]
}
