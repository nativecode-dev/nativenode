import { ObjectNavigator } from './ObjectNavigator'

export interface OnProperty {
  (name: string, value: ObjectNavigator): void
}
