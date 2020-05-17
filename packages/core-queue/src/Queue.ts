import bullmq from 'bullmq'

import { Lincoln } from '@nnode/lincoln'

import { QueueJob } from './QueueJob'
import { QueueConfig } from './QueueConfig'

export class Queue<T = any, R = any> {
  readonly name: string

  protected readonly log: Lincoln
  protected readonly queue: bullmq.Queue<T>

  constructor(name: string, options: QueueConfig, logger: Lincoln) {
    this.log = logger.extend(name)
    this.name = name

    this.log.trace('queue-options', options)
    this.queue = new bullmq.Queue(name, options)

    this.log.debug('created', this.name)
  }

  send(message: T, delay?: number): Promise<QueueJob<T, R>> {
    const options: bullmq.JobsOptions = { delay, removeOnComplete: true, removeOnFail: true, jobId: this.name }
    return this.queue.add(this.name, message, options)
  }
}
