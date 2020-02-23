import { Subscription } from 'rxjs'
import { FlagEnums } from '@nnode/common'

import { Lincoln } from './Lincoln'
import { LincolnEnvelope } from './Interfaces/LincolnEnvelope'
import { LincolnMessageType } from './Interfaces/LincolnMessageType'

export abstract class LincolnLog {
  private readonly subscription: Subscription

  constructor(lincoln: Lincoln, protected readonly display: LincolnMessageType = LincolnMessageType.Informational) {
    this.subscription = lincoln.subscribe(
      envelope => this.next(envelope),
      error => this.error(error),
      async () => {
        this.subscription.unsubscribe()
        await this.complete()
      },
    )
  }

  protected get flags(): FlagEnums {
    return new FlagEnums(this.display)
  }

  protected abstract initialize(): Promise<void>
  protected abstract render(message: LincolnEnvelope): Promise<void>
  protected abstract renderError(message: LincolnEnvelope): Promise<void>

  private complete(): Promise<void> {
    return Promise.resolve(this.subscription.unsubscribe())
  }

  private error(envelope: LincolnEnvelope): Promise<void> {
    return Promise.resolve(this.renderError(envelope))
  }

  private next(envelope: LincolnEnvelope): Promise<void> {
    return Promise.resolve(this.render(envelope))
  }
}
