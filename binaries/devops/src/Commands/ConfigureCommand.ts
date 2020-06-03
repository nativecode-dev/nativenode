import { fs } from '@nofrills/fs'
import { ObjectMap } from '@nnode/objnav'
import { injectable, inject } from 'tsyringe'
import { Arguments, CommandBuilder, CommandModule } from 'yargs'
import { Configuration, ConfigurationKey, Merge } from '@nnode/common'

import { CONSTANT_CONFIG_ENV } from '../index'
import { ConfigureOptions } from '../Options/ConfigureOptions'
import { DEFAULT_CONFIGURATION, ConfigOptions } from '../Options/ConfigOptions'

@injectable()
export class ConfigureCommand implements CommandModule<{}, ConfigureOptions> {
  aliases = ['config', 'configure', 'configuration']
  command = 'configure <action> [options..]'

  builder: CommandBuilder<{}, ConfigureOptions> = {
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
    reset: {
      alias: 'r',
      default: false,
      type: 'boolean',
    },
  }

  constructor(@inject(ConfigurationKey) private readonly configuration: Configuration<ConfigureOptions>) {}

  handler = async (args: Arguments<ConfigureOptions>) => {
    const namevalue = (namevalue: string): { name: string; value: string } => {
      const parts = namevalue.split('=')
      const propName = parts[0]
      const propValue = parts[1]

      return {
        name: propName,
        value: propValue,
      }
    }

    const merged = Merge<ConfigOptions>(DEFAULT_CONFIGURATION, CONSTANT_CONFIG_ENV.toObject())

    if (args.reset) {
      const objmap = ObjectMap.fromJson(merged)
      await this.configuration.save(objmap.toObject())
    } else {
      const config = await this.configuration.load(merged)
      const objmap = ObjectMap.fromJson(config)

      switch (args.action) {
        case 'json':
          console.log(JSON.stringify(objmap.toObject(), null, 2))
          break

        case 'list':
          objmap
            .paths()
            .sort()
            .map((path) => console.log(path))
          break

        case 'set':
          await this.configuration.save(objmap.toObject())
          break
      }
    }
  }
}
