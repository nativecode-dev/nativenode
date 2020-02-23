import { FlagEnums } from '@nnode/common'

import { LincolnMessageType } from '../Interfaces/LincolnMessageType'

export function messageTypeOf(source: LincolnMessageType, target: LincolnMessageType): boolean {
  const flags = new FlagEnums(source)
  return flags.has(target)
}
