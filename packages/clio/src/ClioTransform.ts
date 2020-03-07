import { ClioOptions } from './ClioOptions'

export interface ClioTransform {
  (lines: string[], options: ClioOptions): string[]
}
