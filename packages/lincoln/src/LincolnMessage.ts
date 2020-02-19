import { LincolnMessageType } from './LincolnMessageType'

export interface LincolnMessage {
  body: any
  parameters: Array<Date | number | string>
  type: LincolnMessageType
}
