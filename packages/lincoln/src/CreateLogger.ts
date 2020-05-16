import { Lincoln } from './Lincoln'
import { createOptions } from './CreateOptions'
import { LincolnLogTransform } from './LincolnLogTransform'
import { LincolnOptions } from './LincolnOptions'

export function createLogger(namespace: string | LincolnOptions, transformers: LincolnLogTransform[] = []): Lincoln {
  const options = typeof namespace === 'string' ? createOptions(namespace) : namespace
  const lincoln = new Lincoln(options)
  transformers.map((transformer) => lincoln.intercept(transformer))
  return lincoln
}
