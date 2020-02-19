import { Options as RotatingFileStreamOptions } from 'rotating-file-stream'

export interface LincolnLogFileOptions {
  directory: string
  filemode: number
  logformat: string

  logFileOptions: RotatingFileStreamOptions
}
