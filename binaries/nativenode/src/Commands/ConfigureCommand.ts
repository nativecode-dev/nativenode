import { fs } from '@nofrills/fs'
import { injectable } from 'tsyringe'
import { ObjectNavigator, Configuration } from '@nnode/common'
import { Arguments, CommandBuilder, CommandModule } from 'yargs'

import { ConfigOptions } from '../Options/ConfigOptions'

@injectable()
export class ConfigureCommand implements CommandModule<{}, ConfigOptions> {
  aliases = ['config', 'configure', 'configuration']
  command = 'configure <action> [options..]'

  builder: CommandBuilder<{}, ConfigOptions> = {
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

  handler = async (args: Arguments<ConfigOptions>) => {
    const namevalue = (namevalue: string): { name: string; value: string } => {
      const parts = namevalue.split('=')
      const propName = parts[0]
      const propValue = parts[1]

      return {
        name: propName,
        value: propValue,
      }
    }

    const configuration = new Configuration(args.configuration, '.nativenode.json')
    const config = await configuration.load()

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
      await configuration.save(navigator.toObject())
    }

    if (args.action === 'json') {
      console.log(navigator.toObject())
    }
  }
}
