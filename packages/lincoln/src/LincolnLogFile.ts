import { Merge } from '@nnode/common'
import { createStream, RotatingFileStream } from 'rotating-file-stream'

import { Lincoln } from './Lincoln'
import { LincolnLog } from './LincolnLog'
import { LincolnEnvelope } from './Interfaces/LincolnEnvelope'
import { LincolnLogFileOptions } from './Interfaces/LincolnLogFileOptions'

const DefaultLincolnLogFileOptions: Partial<LincolnLogFileOptions> = {
  directory: process.cwd(),
  filemode: 0o660,
  filename: 'default-app.log',
  rotation: {
    compress: 'gzip',
    encoding: 'utf-8',
    interval: '1d',
  },
}

export class LincolnLogFile extends LincolnLog {
  private readonly options: LincolnLogFileOptions
  private readonly logfile: RotatingFileStream

  constructor(options: Partial<LincolnLogFileOptions>, lincoln: Lincoln) {
    super(lincoln)
    this.options = Merge<LincolnLogFileOptions>(DefaultLincolnLogFileOptions, options)
    this.logfile = createStream(this.options.filename)
  }

  protected async initialize(): Promise<void> {
    return Promise.resolve()
  }

  protected render(envelope: LincolnEnvelope): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logfile.write(JSON.stringify(envelope.message), error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  protected renderError(envelope: LincolnEnvelope): Promise<void> {
    return this.render(envelope)
  }
}
