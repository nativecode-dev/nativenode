import { LincolnMessage } from '../LincolnMessage'

const PATTERN_ACCESS_KEY = /\s{0}([A-Z0-9]{20})\s?/gim
const PATTERN_SECRET_KEY = /\s{0}([A-Za-z0-9/+=]{40})\s?/gim

export function createAwsTransformer(message: LincolnMessage): LincolnMessage {
  if (typeof message.body === 'string') {
    message.attributes = message.attributes.map(attribute =>
      attribute
        .replace(PATTERN_SECRET_KEY, '[AWS_SECRET_ACCESS_KEY]')
        .replace(PATTERN_ACCESS_KEY, '[AWS_ACCESS_KEY_ID]'),
    )

    message.body = message.body
      .replace(PATTERN_SECRET_KEY, '[AWS_SECRET_ACCESS_KEY]')
      .replace(PATTERN_ACCESS_KEY, '[AWS_ACCESS_KEY_ID]')
  }

  message.attributes
    .filter(attribute => typeof attribute === 'string')
    .map(
      (attribute, index, source) =>
        (source[index] = attribute
          .replace(PATTERN_SECRET_KEY, '[AWS_SECRET_ACCESS_KEY]')
          .replace(PATTERN_ACCESS_KEY, '[AWS_ACCESS_KEY_ID]')),
    )

  return message
}
