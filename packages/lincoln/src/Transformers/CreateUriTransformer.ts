import { LincolnMessage } from '../LincolnMessage'

const PATTERN = /((?:git|http[s]?|ftp|ssh):\/\/)(?:.*):(?:.*)@([a-zA-Z0-9\.]+)/gim

export function createUriTransformer(message: LincolnMessage): LincolnMessage {
  if (typeof message.body === 'string') {
    message.attributes = message.attributes.map(attribute => attribute.replace(PATTERN, '[protected] $1$1'))
    message.body = message.body.replace(PATTERN, '[protected] $1$2')
  }

  return message
}
