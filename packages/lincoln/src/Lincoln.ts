import { Merge } from '@nnode/common'
import { Subject, Subscription } from 'rxjs'

import { LincolnMessage } from './LincolnMessage'
import { LincolnEnvelope } from './LincolnEnvelope'
import { LincolnOptions } from './LincolnOptions'
import { createMessage } from './CreateMessage'
import { LincolnMessageType } from './LincolnMessageType'
import { LincolnLogTransform } from './LincolnLogTransform'

const DefaultOptions: Partial<LincolnOptions> = {
  namespaceSeparator: ':',
}

export class Lincoln extends Subject<LincolnEnvelope> {
  private readonly namespace: string[]
  private readonly options: LincolnOptions
  private readonly subscriptions: Subscription[] = []
  private readonly transformers: LincolnLogTransform[] = []

  constructor(options: Partial<LincolnOptions>) {
    super()
    this.options = Merge<LincolnOptions>(DefaultOptions, options)
    this.namespace = this.options.namespace.split(this.options.namespaceSeparator)
  }

  get scope(): string {
    return this.namespace.join(this.options.namespaceSeparator)
  }

  addTransform(transformer: LincolnLogTransform): Lincoln {
    if (this.transformers.includes(transformer) === false) {
      this.transformers.push(transformer)
    }

    return this
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
    return this.transformers.reduce<LincolnMessage>((transformed, transformer) => transformer(transformed), message)
  }
}
