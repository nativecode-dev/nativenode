import { types } from 'util'

import { ObjectMapValue } from './ObjectMapValue'

export type ObjectMapValueFilter = (objmap: ObjectMapValue) => boolean

export class ObjectMap {
  private readonly objmap: ObjectMapValue

  constructor(instance: any) {
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

  get(path: string = '.'): ObjectMapValue {
    if (path === '' || path === '.') {
      return this.root
    }

    return path.split('.').reduce<ObjectMapValue>((result, current) => this.node(result, current), this.root)
  }

  getValue<T>(path: string): T {
    return this.get(path).value
  }

  paths(): string[] {
    return this.select((objmap) => objmap.properties.length > 0).map((objmap) => objmap.path.join('.'))
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

  private map(objmap: ObjectMapValue, name: string): ObjectMapValue {
    const value = objmap.value[name]

    const objvalue: ObjectMapValue = {
      name,
      path: objmap.path.concat([name]),
      properties: [],
      type: this.type(value),
      value,
    }

    if (objvalue.type === 'object' || objvalue.type === 'array') {
      objvalue.properties = Object.keys(objvalue.value).reduce<ObjectMapValue[]>(
        (results, property) => [...results, this.map(objvalue, property)],
        [],
      )
    }

    objmap.properties.push(objvalue)

    return objvalue
  }

  private node(objmap: ObjectMapValue, property: string): ObjectMapValue {
    return objmap.properties.reduce((result, current) => (current.name === property ? current : result), objmap)
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
