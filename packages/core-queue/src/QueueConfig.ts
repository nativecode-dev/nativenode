import bullmq from 'bullmq'

import { Config } from '@nnode/core'

export interface QueueConfig extends Config, bullmq.QueueOptions {}
