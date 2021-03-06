import { Plugin } from './Plugin'

export interface PluginHost {
  fromFiles(filenames: string[]): Promise<Plugin[]>
  fromPlugins(plugins: Plugin[]): Promise<Plugin[]>
}
