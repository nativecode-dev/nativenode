import 'reflect-metadata'

import yargs, { CommandModule } from 'yargs'

import { fs } from '@nofrills/fs'
import { container } from 'tsyringe'
import { Configuration, ConfigurationKey, EnvCaseOptions } from '@nnode/common'

import { Command, CommandModules } from './Commands/Command'
import { CommandOptions } from './Options/CommandOptions'
import { ConfigureCommand } from './Commands/ConfigureCommand'
import { ConfigOptions } from './Options/ConfigOptions'
import { Env } from '@nnode/common'

export const CONSTANT_CONFIG_DIR = fs.join(process.env.HOME || process.cwd(), '.config')
export const CONSTANT_CONFIG_ENV = Env.from({ casing: EnvCaseOptions.PascalCase, prefix: 'DEVOPS' })
export const CONSTANT_CONFIG_NAME = '.devopscli.json'

container.register<Command>(Command, Command)
container.register<CommandModule<{}, CommandOptions>>(CommandModules, ConfigureCommand)

container.register<Configuration<ConfigOptions>>(ConfigurationKey, {
  useFactory: () => new Configuration<ConfigOptions>(CONSTANT_CONFIG_DIR, CONSTANT_CONFIG_NAME),
})

yargs
  .scriptName('devops')
  .config(fs.join(CONSTANT_CONFIG_DIR, CONSTANT_CONFIG_NAME))
  .command<CommandOptions>(container.resolve(Command))
  .showHelpOnFail(true)
  .parse()
