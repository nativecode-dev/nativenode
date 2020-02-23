import { Merge } from '@nnode/common'
import { Subject, Subscription } from 'rxjs'

import { LincolnMessage } from './Interfaces/LincolnMessage'
import { LincolnEnvelope } from './Interfaces/LincolnEnvelope'
import { LincolnOptions } from './Interfaces/LincolnOptions'
import { createMessage } from './Functions/CreateMessage'
import { LincolnMessageType } from './Interfaces/LincolnMessageType'
import { LincolnLogTransform } from './Interfaces/LincolnLogTransform'

const DefaultOptions: Partial<LincolnOptions> = {
  namespaceSeparator: ':',
}

export class Lincoln extends Subject<LincolnEnvelope> {
  private readonly namespace: string[]
  private readonly options: LincolnOptions
  private readonly subscriptions: Subscription[] = []
  private readonly transformers: Set<LincolnLogTransform> = new Set()

  constructor(options: Partial<LincolnOptions>) {
    super()
    this.options = Merge<LincolnOptions>(DefaultOptions, options)
    this.namespace = this.options.namespace.split(this.options.namespaceSeparator)
  }

  get scope(): string {
    return this.namespace.join(this.options.namespaceSeparator)
  }

  close(): void {
    this.complete()

    return this.subscriptions.slice().forEach((sub, index) => {
      delete this.subscriptions[index]
      sub.unsubscribe()
    })
  }

  debug<T>(message: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(message, LincolnMessageType.debug, attributes))
  }

  error<T extends Error>(error: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(error, LincolnMessageType.error, attributes))
  }

  extend(namespace: string): Lincoln {
    const ns = this.namespace.concat(namespace.split(this.options.namespaceSeparator))

    const options = Merge<LincolnOptions>(this.options, {
      namespace: ns.join(this.options.namespaceSeparator),
    })

    const lincoln = new Lincoln(options)

    const subscription = lincoln.subscribe(
      value => this.next(value),
      error => this.error(error),
      () => this.complete(),
    )

    this.subscriptions.push(subscription)

    return lincoln
  }

  fatal<T extends Error>(error: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(error, LincolnMessageType.fatal, attributes))
  }

  info<T>(message: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(message, LincolnMessageType.info, attributes))
  }

  intercept(transformer: LincolnLogTransform): Lincoln {
    this.transformers.add(transformer)
    return this
  }

  interceptors(transformers: LincolnLogTransform[]): Lincoln {
    return transformers.reduce<Lincoln>((lincoln, transformer) => {
      this.transformers.add(transformer)
      return lincoln
    }, this)
  }

  silly<T>(message: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(message, LincolnMessageType.silly, attributes))
  }

  trace<T>(message: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(message, LincolnMessageType.trace, attributes))
  }

  warn<T>(message: T, ...attributes: any[]): Lincoln {
    return this.write(createMessage(message, LincolnMessageType.warn, attributes))
  }

  write(message: LincolnMessage): Lincoln {
    const envelope: LincolnEnvelope = {
      message: this.transform(message),
      created: new Date(),
      scope: this.namespace.join(this.options.namespaceSeparator),
    }

    this.next(envelope)

    return this
  }

  private transform(message: LincolnMessage): LincolnMessage {
    return Array.from(this.transformers.values()).reduce<LincolnMessage>(
      (transformed, transformer) => transformer(transformed),
      message,
    )
  }
}
