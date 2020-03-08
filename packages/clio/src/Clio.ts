import os from 'os'
import readline from 'readline'

import { Merge } from '@nnode/common'

import { transform } from './Functions/Transform'

import { ClioIo } from './ClioIo'
import { timestamp } from './Transformers'
import { ClioOptions } from './ClioOptions'

const DefaultClioIo: ClioIo = {
  stderr: process.stderr,
  stdin: process.stdin,
  stdout: process.stderr,
}

const DefaultClioOptions: ClioOptions = {
  format: {
    includeTimestamp: false,
    timestampFormat: '[{date} {time}] {line}',
  },
  transfomers: [timestamp],
}

export class Clio {
  readonly options: ClioOptions

  private readonly reader: readline.Interface

  constructor(options: Partial<ClioOptions> = {}, private readonly stdio: ClioIo = DefaultClioIo) {
    this.options = Merge<ClioOptions>(DefaultClioOptions, options)
    this.reader = readline.createInterface(this.stdio.stdin, this.stdio.stdout, undefined, false)
  }

  read(): Promise<string> {
    return new Promise(resolve => {
      const listener = (input: string) => {
        this.reader.off('line', listener)
        resolve(input)
      }

      this.reader.on('line', input => listener(input))
    })
  }

  write(message: string | string[], conditions: boolean[] = [true]): void {
    if (conditions.some(condition => condition === false)) {
      return
    }

    const lines = transform(message, this.options)

    lines.map(line => {
      this.stdio.stdout.write(line)
      this.stdio.stdout.write(os.EOL)
    })
  }
}
