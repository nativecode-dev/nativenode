import http from 'http'
import express from 'express'

import { Lincoln } from '@nnode/lincoln'
import { Merge, DeepPartial, Runnable } from '@nnode/core'

import { ServerConfig } from './ServerConfig'

export const ServerConfigurationType = Symbol('ServerConfiguration')

export abstract class Server<T extends ServerConfig> implements Runnable {
  readonly config: T
  readonly name: string
  readonly server: http.Server

  protected readonly app: express.Express
  protected readonly log: Lincoln

  constructor(name: string, logger: Lincoln, config: DeepPartial<T>) {
    this.name = name
    this.log = logger.extend(name)
    this.config = Merge<T>([config])

    this.app = express()
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())

    this.server = http.createServer(this.app)

    this.log.debug('create', this.name)
  }

  async initialize(): Promise<void> {
    try {
      this.config.statics.map((dir) => {
        this.log.debug('using static folder:', dir)
        express.static(dir)
      })

      await this.bootstrap(this.app)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.config.port, () => resolve())
      console.log(`listening ${this.config.host}:${this.config.port}`)
    })
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  protected abstract bootstrap(app: express.Express): Promise<void>
}
