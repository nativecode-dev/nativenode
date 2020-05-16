import moment from 'moment'

export function Moment(
  value: moment.MomentInput,
  format?: string | moment.MomentBuiltinFormat | (string | moment.MomentBuiltinFormat)[],
  strict: boolean = false,
): moment.Moment {
  return moment(value, format, strict)
}
