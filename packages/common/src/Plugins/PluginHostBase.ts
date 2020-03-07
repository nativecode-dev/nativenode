import { Plugin } from './Plugin'
import { PluginHost } from './PluginHost'
import { PluginHostOptions } from './PluginHostOptions'

export abstract class PluginHostBase implements PluginHost {
  private readonly instances: Set<Plugin> = new Set()

  constructor(protected readonly options: PluginHostOptions) {}

  get plugins(): Iterable<Plugin> {
    return this.instances.values()
  }

  fromFiles(filenames: string[]): Promise<Plugin[]> {
    return Promise.resolve(
      filenames.reduce<Plugin[]>((result, current) => {
        const plugin = require(current)
        return [...result, plugin]
      }, []),
    )
  }

  fromPlugins(plugins: Plugin[]): Promise<Plugin[]> {
    return Promise.resolve<Plugin[]>(
      Array.from(
        plugins.reduce((results, plugin) => {
          results.add(plugin)
          return results
        }, this.instances),
      ),
    )
  }
}
