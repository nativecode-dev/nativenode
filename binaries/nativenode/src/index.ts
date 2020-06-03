import 'reflect-metadata'

import yargs from 'yargs'

import { container } from 'tsyringe'

import { Command } from './Commands/Command'
import { CommandOptions } from './Options/CommandOptions'
import { ConfigureCommand } from './Commands/ConfigureCommand'

container.register<ConfigureCommand>(ConfigureCommand, ConfigureCommand)

yargs
  .scriptName('nativenode')
  .config(`${process.env.HOME}/.config/.nativenode.json`)
  .command<CommandOptions>(new Command())
  .showHelpOnFail(true)
  .parse()
