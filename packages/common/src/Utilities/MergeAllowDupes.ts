import deepmerge from 'deepmerge'
import { DeepPartial } from 'ts-essentials'
export function MergeAllowDupes<T>(...objects: Array<DeepPartial<T>>): T {
  const partials = objects.map<Partial<T>>((item) => item as Partial<T>)
  return deepmerge.all<T>(partials, { clone: true })
}
