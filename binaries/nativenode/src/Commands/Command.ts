import { injectable } from 'tsyringe'
import { Arguments, Argv, CommandModule } from 'yargs'

import { ConfigureCommand } from './ConfigureCommand'
import { CommandOptions } from '../Options/CommandOptions'

@injectable()
export class Command implements CommandModule<{}, CommandOptions> {
  command = '$0 <command>'

  builder = (args: Argv): Argv<CommandOptions> => {
    return args
      .option('command', { choices: ['configure'], default: 'configure', type: 'string' })
      .command(new ConfigureCommand())
  }

  handler = (args: Arguments<CommandOptions>) => {
    return
  }
}
