import deepmerge from 'deepmerge'

import { DeepPartial } from './DeepPartial'

const DefaultOptions: Partial<deepmerge.Options> = {
  clone: true,
}

export function MergeAll<T>(options: deepmerge.Options, ...objects: Array<DeepPartial<T>>): T {
  const partials = objects.map<Partial<T>>(item => item as Partial<T>)
  return deepmerge.all<T>(partials, deepmerge.all([DefaultOptions, options]))
}
