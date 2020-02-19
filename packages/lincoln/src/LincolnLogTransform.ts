import { LincolnMessage } from './LincolnMessage'

export interface LincolnLogTransform {
  (message: LincolnMessage): LincolnMessage
}
