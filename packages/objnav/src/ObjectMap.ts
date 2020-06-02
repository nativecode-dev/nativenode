import { types } from 'util'
import { DeepPartial, Merge } from '@nnode/common'

import { ObjectMapValue } from './ObjectMapValue'
import { ObjectMapOptions } from './ObjectMapOptions'

export type ObjectMapValueFilter = (objmap: ObjectMapValue) => boolean

const DefaultObjectMapOptions: DeepPartial<ObjectMapOptions> = {
  include: {
    arrays: true,
    dates: true,
    functions: false,
    numbers: true,
    objects: true,
    strings: true,
  },
}

export class ObjectMap {
  private readonly objmap: ObjectMapValue
  private readonly options: ObjectMapOptions

  constructor(instance: any, options: DeepPartial<ObjectMapOptions> = {}) {
    this.options = Merge<ObjectMapOptions>(DefaultObjectMapOptions, options)

    this.objmap = {
      name: 'root',
      path: [],
      properties: [],
      type: this.type(instance),
      value: instance,
    }

    Object.keys(instance).forEach((name) => this.map(this.objmap, name))
  }

  get nodes(): ObjectMapValue[] {
    return this.select((objmap) => objmap.properties.length === 0)
  }

  get root(): ObjectMapValue {
    return this.objmap
  }

  get(path: string = ''): ObjectMapValue {
    if (path === '' || path === '.') {
      return this.root
    }

    return path.split('.').reduce<ObjectMapValue>((result, current) => this.node(result, current), this.root)
  }

  getValue<T>(path: string): T {
    return this.get(path).value
  }

  materialze(): any {
    const conjure = (objmap: ObjectMapValue, target: any): any => {
      if (this.include(objmap.type) === false) {
        return target
      }

      return objmap.properties
        .filter((property) => this.include(property.type))
        .reduce<any>((result, property) => {
          if (objmap.type === 'array') {
            const value = result[property.name] || []
            result[property.name] = value.push(property.value)
          } else if (property.type === 'object') {
            result[property.name] = conjure(property, {})
          } else {
            result[property.name] = property.value
          }

          return result
        }, target)
    }

    const material = {}
    conjure(this.root, material)
    return material
  }

  paths(): string[] {
    return this.select().map((objmap) => this.pathstr(objmap))
  }

  select(filter: ObjectMapValueFilter | undefined = () => true): ObjectMapValue[] {
    const apply = (objmap: ObjectMapValue, list: ObjectMapValue[]): ObjectMapValue[] => {
      return objmap.properties.reduce<ObjectMapValue[]>((results, property) => {
        const properties = apply(property, [])

        if (filter(property)) {
          return results.concat(properties).concat([property])
        }

        return results.concat([property])
      }, list)
    }

    return apply(this.root, [])
  }

  set<T>(path: string, value: T): ObjectMapValue {
    const objmap = this.get(path)
    objmap.value = value
    return objmap
  }

  private include(type: string): boolean {
    switch (type) {
      case 'array':
        return this.options.include.arrays
      case 'date':
        return this.options.include.dates
      case 'function':
        return this.options.include.functions
      case 'number':
        return this.options.include.numbers
      case 'object':
        return this.options.include.objects
      case 'string':
        return this.options.include.strings
      default:
        return true
    }
  }

  private map(objmap: ObjectMapValue, name: string): ObjectMapValue {
    const value = objmap.value[name]
    const type = this.type(value)
    const included = this.include(type)

    const objvalue: ObjectMapValue = {
      name,
      path: objmap.path.concat([name]),
      properties: [],
      type,
      value,
    }

    if (included && (objvalue.type === 'object' || objvalue.type === 'array')) {
      objvalue.properties = Object.keys(objvalue.value).reduce<ObjectMapValue[]>((results, property) => {
        const map = this.map(objvalue, property)

        if (this.include(map.type)) {
          return [...results, map]
        }

        return results
      }, [])
    }

    if (included) {
      objmap.properties.push(objvalue)
    }

    return objvalue
  }

  private node(objmap: ObjectMapValue, property: string): ObjectMapValue {
    return objmap.properties.reduce((result, current) => (current.name === property ? current : result), objmap)
  }

  private pathstr(objmap: ObjectMapValue): string {
    return objmap.path.join('.')
  }

  private type(value: any): string {
    const type = typeof value

    switch (type) {
      case 'object':
        if (Array.isArray(value)) {
          return 'array'
        }

        if (types.isDate(value)) {
          return 'date'
        }

        return type
      default:
        return type
    }
  }
}
