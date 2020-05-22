import { Lincoln, createLogger } from '@nnode/lincoln'
import { DependencyContainer, container } from 'tsyringe'

import { Configuration, AppConfig } from './config'
import { Runnable, RunnableConstructor } from './Runnable'

export abstract class Application<TConfig extends AppConfig> {
  protected readonly container: DependencyContainer

  constructor(
    readonly name: string,
    readonly configuration: Configuration<TConfig>,
    private readonly server: RunnableConstructor,
  ) {
    this.container = container.createChildContainer()
  }

  async run() {
    await this.setup()

    process.on('SIGTERM', () => process.exit())
    process.on('SIGHUP', () => process.exit())
    process.on('SIGUSR1', () => process.exit())
    process.on('SIGUSR2', () => process.exit())
    process.on('uncaughtException', async (error) => console.error(error))
    process.on('unhandledRejection', async (error) => console.error(error))

    const runnable = await this.build()

    await runnable.initialize()
    await this.configuration.save()

    return runnable.start()
  }

  protected async build(): Promise<Runnable> {
    return this.container.resolve(this.server)
  }

  protected async setup(): Promise<TConfig> {
    const config = await this.configuration.load()
    this.container.register<Lincoln>(Symbol('logger'), { useValue: createLogger(this.name) })
    this.dependencies(this.container, config)
    return config
  }

  protected abstract dependencies(container: DependencyContainer, config: TConfig): void
}
