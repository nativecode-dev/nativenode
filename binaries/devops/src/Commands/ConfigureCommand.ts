import { fs } from '@nofrills/fs'
import { injectable, inject } from 'tsyringe'
import { Arguments, CommandBuilder, CommandModule } from 'yargs'
import { ObjectNavigator, Configuration, ConfigurationKey } from '@nnode/common'

import { CommandOptions } from '../Options/CommandOptions'
import { DEFAULT_CONFIGURATION } from '../Options/ConfigOptions'

@injectable()
export class ConfigureCommand implements CommandModule<{}, CommandOptions> {
  aliases = ['config', 'configure', 'configuration']
  command = 'configure <action> [options..]'

  builder: CommandBuilder<{}, CommandOptions> = {
    action: {
      choices: ['get', 'json', 'set', 'show'],
      default: 'show',
      type: 'string',
    },
    configpath: {
      alias: ['c'],
      default: fs.join(process.env.HOME || process.cwd(), '.config'),
      type: 'string',
    },
    options: {
      default: [],
      string: true,
      type: 'array',
    },
  }

  constructor(@inject(ConfigurationKey) private readonly configuration: Configuration<CommandOptions>) {}

  handler = async (args: Arguments<CommandOptions>) => {
    const namevalue = (namevalue: string): { name: string; value: string } => {
      const parts = namevalue.split('=')
      const propName = parts[0]
      const propValue = parts[1]

      return {
        name: propName,
        value: propValue,
      }
    }

    const config = await this.configuration.load(DEFAULT_CONFIGURATION)

    const navigator = args.options.reduce<ObjectNavigator>((nav, current) => {
      const { name, value } = namevalue(current)

      if (args.action === 'get') {
        console.log(name, nav.getValue(name))
      }

      if (args.action === 'show') {
        console.log(name, value)
      }

      if (args.action === 'set') {
        nav.set(name, value)
      }

      return nav
    }, ObjectNavigator.from(config))

    if (args.action === 'set') {
      await this.configuration.save(navigator.toObject())
    }

    if (args.action === 'json') {
      console.log(navigator.toObject())
    }
  }
}
