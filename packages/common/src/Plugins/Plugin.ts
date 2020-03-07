export interface Plugin {
  description?: string
  enabled: boolean
  name: string

  activate(): Promise<void>
  deactivate(): Promise<void>
}
