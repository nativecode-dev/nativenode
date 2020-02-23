import { Options as RotatingFileStreamOptions } from 'rotating-file-stream'

export interface LincolnLogFileOptions {
  directory: string
  filemode: number
  filename: string
  rotation: RotatingFileStreamOptions
}
