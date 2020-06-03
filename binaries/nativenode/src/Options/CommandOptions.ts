import { Options } from 'yargs'

export interface CommandOptions extends Options {
  configuration: string
  options: string[]
}
