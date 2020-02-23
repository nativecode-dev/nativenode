import { LincolnMessageOf } from '../Interfaces/LincolnMessageOf'
import { LincolnMessageType } from '../Interfaces/LincolnMessageType'

export function createMessage<T>(message: T, type: LincolnMessageType, attributes: any[] = []): LincolnMessageOf<T> {
  return { parameters: attributes, body: message, type }
}
