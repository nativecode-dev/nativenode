import 'reflect-metadata'

import yargs, { CommandModule } from 'yargs'

import { fs } from '@nofrills/fs'
import { container } from 'tsyringe'
import { Configuration, ConfigurationKey, DeepPartial } from '@nnode/common'

import { Command, CommandModules } from './Commands/Command'
import { CommandOptions } from './Options/CommandOptions'
import { ConfigureCommand } from './Commands/ConfigureCommand'
import { ConfigOptions } from './Options/ConfigOptions'

const CONFIG_DIR = fs.join(process.env.HOME || process.cwd(), '.config')
const CONFIG_NAME = '.nativenode.json'

container.register<Command>(Command, Command)
container.register<CommandModule<{}, CommandOptions>>(CommandModules, ConfigureCommand)
container.register<Configuration<ConfigOptions>>(ConfigurationKey, {
  useFactory: () => new Configuration<ConfigOptions>(CONFIG_DIR, CONFIG_NAME),
})

yargs
  .scriptName('nativenode')
  .config(fs.join(CONFIG_DIR, CONFIG_NAME))
  .command<CommandOptions>(container.resolve(Command))
  .showHelpOnFail(true)
  .parse()
