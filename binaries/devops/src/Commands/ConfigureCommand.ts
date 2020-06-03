import { fs } from '@nofrills/fs'
import { ObjectMap } from '@nnode/objnav'
import { injectable, inject } from 'tsyringe'
import { Arguments, CommandBuilder, CommandModule } from 'yargs'
import { Configuration, ConfigurationKey, Merge } from '@nnode/common'

import { CONSTANT_CONFIG_ENV } from '../index'
import { CommandOptions } from '../Options/CommandOptions'
import { DEFAULT_CONFIGURATION, ConfigOptions } from '../Options/ConfigOptions'

@injectable()
export class ConfigureCommand implements CommandModule<{}, CommandOptions> {
  aliases = ['config', 'configure', 'configuration']
  command = 'configure <action> [options..]'

  builder: CommandBuilder<{}, CommandOptions> = {
    action: {
      choices: ['get', 'json', 'list', 'set', 'show'],
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

    const config = await this.configuration.load(
      Merge<ConfigOptions>(DEFAULT_CONFIGURATION, CONSTANT_CONFIG_ENV.toObject()),
    )

    const objmap = ObjectMap.fromJson(config)

    switch (args.action) {
      case 'json':
        console.log(objmap.toObject())
        break

      case 'list':
        objmap
          .paths()
          .sort()
          .map((path) => console.log(path))
        break

      case 'set':
        this.configuration.save(objmap.toObject())
        break
    }
  }
}
