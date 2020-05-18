import { AppConfig } from '@nnode/core'

export interface ServerConfig extends AppConfig {
  enableSessions: boolean
  enableWebSockets: boolean
  host: string
  port: number
  statics: string[]
}

export const ServerConfigType = Symbol('ServerConfig')
