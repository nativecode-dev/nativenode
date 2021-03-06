import { ConfigurationOptions, DeepPartial } from '@nnode/common'

export interface Connection {
  host: string
  name: string
  port: number

  authentication: {
    login: string
    password: string
  }

  options: { [key: string]: string }
}

export interface ConfigOptions extends ConfigurationOptions {
  connections: Connection[]
}

export const DEFAULT_CONFIGURATION: DeepPartial<ConfigOptions> = {
  connections: [
    {
      authentication: {
        login: 'admin',
        password: '',
      },
      host: 'localhost',
      name: 'couchdb',
      options: {
        adapter: 'web',
        url: 'devops',
      },
      port: 5984,
    },
  ],
}
