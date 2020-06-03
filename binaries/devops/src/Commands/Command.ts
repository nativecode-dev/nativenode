import { injectable, injectAll } from 'tsyringe'
import { Arguments, Argv, CommandModule } from 'yargs'

import { CommandOptions } from '../Options/CommandOptions'

export const CommandModules: symbol = Symbol('nativenode.Commands.CommandModules')

@injectable()
export class Command implements CommandModule<{}, CommandOptions> {
  command = '$0 <command>'

  constructor(@injectAll(CommandModules) private readonly commands: CommandModule<{}, CommandOptions>[]) {}

  builder = (args: Argv<{}>): Argv<CommandOptions> => {
    const yargs = args
      .option('command', { choices: ['configure'], default: 'configure', type: 'string' })
      .command(this.commands[0])

    return this.commands.slice(1).reduce<Argv<CommandOptions>>((result, command) => result.command(command), yargs)
  }

  handler = (args: Arguments<CommandOptions>) => {}
}
