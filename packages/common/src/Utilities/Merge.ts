import deepmerge from 'deepmerge'

import { Dedupe } from './Dedupe'
import { DeepPartial } from './DeepPartial'

const DefaultOptions: Partial<deepmerge.Options> = {
  arrayMerge: Dedupe,
  clone: true,
}

export function Merge<T>(...objects: Array<DeepPartial<T>>): T {
  const partials = objects.map<Partial<T>>(item => item as Partial<T>)
  return deepmerge.all<T>(partials, DefaultOptions)
}

export function MergeAllowDupes<T>(...objects: Array<DeepPartial<T>>): T {
  const partials = objects.map<Partial<T>>(item => item as Partial<T>)
  return deepmerge.all<T>(partials, { clone: true })
}
