export interface Plugin {
  enabled: boolean
  name: string

  activate(): Promise<void>
  deactivate(): Promise<void>
}
