import { ClioOptions } from '../ClioOptions'

function addTimestamp(line: string, options: ClioOptions): string {
  if (options.format.includeTimestamp) {
    const now = new Date()
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString()

    return options.format.timestampFormat.replace('{:date}', date).replace('{:time}', time).replace('{:line}', line)
  }

  return line
}

export function timestamp(lines: string[], options: ClioOptions): string[] {
  return lines.map((line) => addTimestamp(line, options))
}
