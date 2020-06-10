import { EnvCaseOptions } from './EnvCaseOptions'

export interface EnvOptions {
  casing: EnvCaseOptions
  env: NodeJS.ProcessEnv
  prefix: string
}
