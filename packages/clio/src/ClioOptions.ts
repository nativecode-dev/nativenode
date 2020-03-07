import { ClioTransform } from './ClioTransform'

export interface ClioOptions {
  format: {
    includeTimestamp: boolean
    timestampFormat: string
  }
  transfomers: ClioTransform[]
}
