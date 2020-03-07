import os from 'os'

import { ClioOptions } from '../ClioOptions'

export function transform(message: string | string[], options: ClioOptions): string[] {
  return options.transfomers.reduce<string[]>(
    (results, current) => current(results, options),
    typeof message === 'string'
      ? message.split(os.EOL)
      : message.reduce<string[]>((results, current) => [...results, ...current.split(os.EOL)], []),
  )
}
