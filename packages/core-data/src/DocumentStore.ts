import PouchDB from 'pouchdb'

import { Lincoln } from '@nnode/lincoln'
import { Throttle, injectable, scoped, Lifecycle, DeepPartial, Merge } from '@nnode/core'

export abstract class BaseDocumentStore<T> extends PouchDB<T> {
  private readonly log: Lincoln

  constructor(options: PouchDB.Configuration.DatabaseConfiguration, logger: Lincoln) {
    super(options.name, options)
    this.log = logger.extend('base-document-store')
    this.log.trace('ctor', options)
  }

  createIndexes(indexes: PouchDB.Find.CreateIndexOptions[]) {
    const tasks = indexes.map((index) => () => this.createIndex(index))
    return Throttle(tasks)
  }

  async exists(id: string, selector?: PouchDB.Find.Selector): Promise<T | undefined> {
    const defaults: DeepPartial<PouchDB.Find.FindRequest<T>> = { selector: { _id: { $eq: id } } }
    const overrides = selector ? { selector } : {}
    const query = Merge<PouchDB.Find.FindRequest<T>>([defaults, overrides])
    const results = await this.find(query)
    return results.docs.reduce<T | undefined>((result, current) => (current._id === id ? result : undefined), undefined)
  }
}

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class DocumentStore extends BaseDocumentStore<any> {
  constructor(options: PouchDB.Configuration.DatabaseConfiguration, logger: Lincoln) {
    super(options, logger)
  }
}
