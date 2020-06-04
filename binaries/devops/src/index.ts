import 'reflect-metadata'

import yargs from 'yargs'

import { fs } from '@nofrills/fs'
import { Env } from '@nnode/common'
import { container } from 'tsyringe'
import { LincolnLogDebug } from '@nnode/lincoln-debug'
import { Lincoln, LoggerType, createLogger } from '@nnode/lincoln'
import { Configuration, ConfigurationKey, EnvCaseOptions } from '@nnode/common'

import { Command, CommandModules } from './Commands/Command'
import { ConfigureCommand } from './Commands/ConfigureCommand'

import { CommandOptions } from './Options/CommandOptions'
import { ConfigOptions } from './Options/ConfigOptions'

export const CONSTANT_CONFIG_DIR = fs.join(process.env.HOME || process.cwd(), '.config')
export const CONSTANT_CONFIG_ENV = Env.from({ casing: EnvCaseOptions.PascalCase, prefix: 'DEVOPS' })
export const CONSTANT_CONFIG_NAME = '.devopscli.json'

container.register<Command>(Command, Command)
container.register(CommandModules, ConfigureCommand)

container.register<Configuration<ConfigOptions>>(ConfigurationKey, {
  useFactory: () => new Configuration<ConfigOptions>(CONSTANT_CONFIG_DIR, CONSTANT_CONFIG_NAME),
})

container.register<Lincoln>(LoggerType, {
  useFactory: () => {
    const logger = createLogger('devops')
    LincolnLogDebug.observe(logger)
    return logger
  },
})

yargs
  .scriptName('devops')
  .config(fs.join(CONSTANT_CONFIG_DIR, CONSTANT_CONFIG_NAME))
  .command<CommandOptions>(container.resolve(Command))
  .showHelpOnFail(true)
  .parse()
