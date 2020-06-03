import deepmerge from 'deepmerge'

import { DeepPartial } from 'ts-essentials'

import { Dedupe } from './Dedupe'

const DefaultOptions: Partial<deepmerge.Options> = {
  arrayMerge: Dedupe,
  clone: true,
}

export function Merge<T>(...objects: Array<DeepPartial<T>>): T {
  const partials = objects.map<Partial<T>>((item) => item as Partial<T>)
  return deepmerge.all<T>(partials, DefaultOptions)
}
