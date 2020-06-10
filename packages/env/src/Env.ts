import camelcase from 'camelcase'
import capitalize from 'capitalize'
import pascalcase from 'pascalcase'

import { DeepPartial, MergeAll } from '@nnode/common'

import { EnvOptions } from './EnvOptions'
import { EnvCaseOptions } from './EnvCaseOptions'

export class Env {
  private readonly options: EnvOptions

  constructor(options: DeepPartial<EnvOptions> = {}) {
    this.options = MergeAll<EnvOptions>(
      { clone: true },
      { casing: EnvCaseOptions.lowerCase, env: process.env, prefix: 'app' },
      options,
    )
  }

  toObject(): any {
    const obj = this.paths()
      .map((path) => path.split('.'))
      .reduce<any>((result, paths) => ({ ...result, ...this.createNode(paths, result) }), {})

    return obj
  }

  protected casing(value: string, casing: EnvCaseOptions): string {
    switch (casing) {
      case EnvCaseOptions.camelCase:
        return camelcase(value)

      case EnvCaseOptions.capitalize:
        return capitalize(value)

      case EnvCaseOptions.lowerCase:
        return value.toLowerCase()

      case EnvCaseOptions.pascalCase:
        return pascalcase(value)

      case EnvCaseOptions.upperCase:
        return value.toUpperCase()

      default:
        return value
    }
  }

  private createNode(paths: string[], context: any = {}): any {
    const lastIndex = paths.length - 1
    const parts = paths.slice(0, lastIndex)
    const property = this.casing(paths.slice(lastIndex).join(), this.options.casing)
    const value = this.options.env[paths.join('_')]

    const varobj = parts.reduce<any>((result, current) => {
      const key = this.casing(current, this.options.casing)
      if (result[key]) {
        return result[key]
      }
      return (result[key] = {})
    }, context)

    varobj[property] = value

    return context
  }

  private paths(): string[] {
    return Object.keys(this.options.env)
      .reduce<string[]>((result, current) => [...result, current.replace(/\_/g, '.')], [])
      .filter((paths) => paths.toUpperCase().startsWith(this.options.prefix.toUpperCase()))
      .sort()
  }
}
