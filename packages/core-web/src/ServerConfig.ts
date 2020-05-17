import { Config } from '@nnode/core'

export interface ServerConfig extends Config {
  enableSessions: boolean
  enableWebSockets: boolean
  host: string
  port: number
  statics: string[]
}

export const ServerConfigType = Symbol('ServerConfig')
