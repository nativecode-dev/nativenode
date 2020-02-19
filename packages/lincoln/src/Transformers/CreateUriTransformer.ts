import { LincolnMessage } from '../LincolnMessage'

const PATTERN = /((?:git|http[s]?|ftp|ssh):\/\/)(?:.*):(?:.*)@([a-zA-Z0-9\.]+)/gim

export function createUriTransformer(message: LincolnMessage): LincolnMessage {
  if (typeof message.body === 'string') {
    message.body = message.body.replace(PATTERN, '[protected] $1$2')

    message.parameters = message.parameters.map(parameter => {
      if (typeof parameter === 'string') {
        return parameter.replace(PATTERN, '[protected] $1$1')
      }

      return parameter
    })
  }

  return message
}
