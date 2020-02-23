import { Lincoln } from '../Lincoln'
import { createOptions } from './CreateOptions'
import { LincolnLogTransform } from '../Interfaces/LincolnLogTransform'
import { LincolnOptions } from '../Interfaces/LincolnOptions'

export function createLogger(namespace: string | LincolnOptions, transformers: LincolnLogTransform[] = []): Lincoln {
  const options = typeof namespace === 'string' ? createOptions(namespace) : namespace
  const lincoln = new Lincoln(options)
  transformers.map(transformer => lincoln.intercept(transformer))
  return lincoln
}
