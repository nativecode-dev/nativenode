import http from 'http'
import express from 'express'

import { Merge, DeepPartial, Logger, Lincoln, Runnable } from '@nnode/core'

import { ServerConfig } from './ServerConfig'

export const ServerConfigurationType = Symbol('ServerConfiguration')

export abstract class Server<T extends ServerConfig> implements Runnable {
  readonly config: T
  private readonly express: express.Express
  private readonly http: http.Server

  protected readonly log: Lincoln
  protected readonly name: string

  constructor(name: string, app: express.Express, logger: Lincoln, config: DeepPartial<T>) {
    this.name = name
    this.log = Logger.extend(name)
    this.config = Merge<T>([config])
    this.http = http.createServer(app)

    this.express = app
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.json())

    this.log.debug('create', this.name)
  }

  async initialize(): Promise<void> {
    try {
      this.config.statics.map((dir) => {
        this.log.debug('using static folder:', dir)
        express.static(dir)
      })

      await this.bootstrap(this.express)

      const routes = this.express._router.stack.filter((item: any) => item.route).map((item: any) => item.route.path)
      this.log.debug('routes', ...routes)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.http.listen(this.config.port, () => resolve())
      console.log(`listening ${this.config.machine}:${this.config.port}`)
    })
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  protected get server(): http.Server {
    return this.http
  }

  protected abstract bootstrap(express: express.Express): Promise<void>
}
