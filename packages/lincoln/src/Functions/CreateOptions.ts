import { LincolnOptions } from '../Interfaces/LincolnOptions'

export function createOptions(namespace: string): LincolnOptions {
  return { namespace, namespaceSeparator: ':' }
}
