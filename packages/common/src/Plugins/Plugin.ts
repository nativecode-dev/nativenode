export interface Plugin {
  readonly activated: boolean
  readonly enabled: boolean
  readonly name: string

  description?: string

  activate(): Promise<void>
  deactivate(): Promise<void>
  disable(): Promise<void>
  enable(): Promise<void>
}
