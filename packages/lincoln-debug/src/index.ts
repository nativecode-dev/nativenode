import debug from 'debug'

import { LincolnLog, LincolnEnvelope, LincolnMessageType } from '@nnode/lincoln'

interface DebugCache {
  [key: string]: debug.IDebugger
}

const Cache: DebugCache = {}

export class LincolnLogDebug extends LincolnLog {
  protected initialize(): Promise<void> {
    return Promise.resolve()
  }

  protected render(envelope: LincolnEnvelope): Promise<void> {
    const scope = `${envelope.scope}:${this.messageTypeString(envelope.message.type)}`
    const logger: debug.IDebugger = Cache[scope] ? Cache[scope] : (Cache[scope] = debug(scope))

    const messageHasString = typeof envelope.message.body === 'string'
    const messageHasParams = envelope.message.parameters.length > 0

    if (messageHasString && messageHasParams) {
      logger(envelope.message.body, ...envelope.message.parameters)
    } else if (messageHasString) {
      logger(envelope.message.body)
    } else {
      logger(JSON.stringify(envelope.message, null, 2))
    }

    return Promise.resolve()
  }

  protected renderError(envelope: LincolnEnvelope): Promise<void> {
    return this.render(envelope)
  }

  protected messageTypeString(type: LincolnMessageType): string {
    switch (type) {
      case LincolnMessageType.debug:
        return 'debug'
      case LincolnMessageType.error:
        return 'error'
      case LincolnMessageType.fatal:
        return 'fatal'
      case LincolnMessageType.info:
        return 'info'
      case LincolnMessageType.silly:
        return 'silly'
      case LincolnMessageType.trace:
        return 'trace'
      case LincolnMessageType.warn:
        return 'watcn'
      default:
        return 'unknown'
    }
  }
}
