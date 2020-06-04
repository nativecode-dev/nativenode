import os from 'os'

import { fs } from '@nofrills/fs'
import { ObjectMap } from '@nnode/objnav'
import { injectable, inject } from 'tsyringe'
import { Lincoln, LoggerType } from '@nnode/lincoln'
import { Arguments, CommandBuilder, CommandModule } from 'yargs'
import { Configuration, ConfigurationKey, Merge, MergeAll } from '@nnode/common'

import { CONSTANT_CONFIG_ENV } from '../index'
import { ConfigureOptions } from '../Options/ConfigureOptions'
import { DEFAULT_CONFIGURATION, ConfigOptions } from '../Options/ConfigOptions'

@injectable()
export class ConfigureCommand implements CommandModule<{}, ConfigureOptions> {
  private readonly log: Lincoln

  aliases = ['config', 'configure', 'configuration']
  command = 'configure <action> [options..]'

  builder: CommandBuilder<{}, ConfigureOptions> = {
    action: {
      choices: ['get', 'json', 'list', 'set', 'show'],
      default: 'show',
      type: 'string',
    },
    configpath: {
      alias: 'c',
      default: fs.join(process.env.HOME || os.homedir(), '.config'),
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

  constructor(
    @inject(LoggerType) logger: Lincoln,
    @inject(ConfigurationKey) private readonly configuration: Configuration<ConfigureOptions>,
  ) {
    this.log = logger.extend('configure-command')
  }

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

    const merged = MergeAll<ConfigOptions>({}, DEFAULT_CONFIGURATION, CONSTANT_CONFIG_ENV.toObject())

    this.log.trace('merged', JSON.stringify(merged, null, 2))

    if (args.reset) {
      const objmap = ObjectMap.fromJson(merged)
      await this.configuration.save(objmap.toObject())
    }

    if (args.reset === false) {
      const config = await this.configuration.load(merged)
      const objmap = ObjectMap.fromJson(config)
      this.log.trace('loaded', JSON.stringify(config, null, 2))

      switch (args.action) {
        case 'json':
          console.log(JSON.stringify(objmap.toObject(), null, 2))
          break

        case 'set':
          args.options.map((arg) => namevalue(arg)).forEach(({ name, value }) => objmap.set(name, value))
          await this.configuration.save(objmap.toObject())
          this.log.trace('saved', JSON.stringify(objmap.toObject(), null, 2))
          break

        default:
          objmap
            .paths()
            .sort()
            .map((path) => console.log(path))
          break
      }
    }
  }
}
