import debug from 'debug'

import { LincolnLog, LincolnEnvelope } from '@nnode/lincoln'

interface DebugCache {
  [key: string]: debug.IDebugger
}

const Cache: DebugCache = {}

export class LincolnLogDebug extends LincolnLog {
  protected initialize(): Promise<void> {
    return Promise.resolve()
  }

  protected render(envelope: LincolnEnvelope): Promise<void> {
    const logger: debug.IDebugger = Cache[envelope.scope]
      ? Cache[envelope.scope]
      : (Cache[envelope.scope] = debug(envelope.scope))

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
}
