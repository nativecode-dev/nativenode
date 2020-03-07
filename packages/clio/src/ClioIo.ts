export interface ClioIo {
  stderr: NodeJS.WritableStream
  stdin: NodeJS.ReadableStream
  stdout: NodeJS.WritableStream
}
