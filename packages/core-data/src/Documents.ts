import { Lincoln } from '@nnode/lincoln'
import { Merge, DeepPartial } from '@nnode/core'

import { Document } from './Document'
import { CouchConfig } from './config/CouchConfig'
import { BaseDocumentStore } from './DocumentStore'

export type Meta = PouchDB.Core.IdMeta | PouchDB.Core.RevisionIdMeta

export interface PropertyNames<T extends Document> {
  (document: T): string[]
}

export abstract class Documents<T extends Document> {
  abstract readonly indexes: PouchDB.Find.CreateIndexOptions[]

  protected readonly log: Lincoln

  constructor(public readonly type: string, private readonly store: BaseDocumentStore<T>, logger: Lincoln) {
    this.log = logger.extend(type)
  }

  async all(selector?: PouchDB.Find.FindRequest<T>): Promise<Array<T>> {
    const required: PouchDB.Find.FindRequest<T> = {
      selector: {
        meta__doctype: this.type,
      },
      limit: Number.MAX_SAFE_INTEGER,
    }

    const query = Merge<PouchDB.Find.FindRequest<T>>([required, selector || {}])
    return this.find(query)
  }

  async bulk(updates: T[]): Promise<Array<PouchDB.Core.Response | PouchDB.Core.Error>> {
    this.log.trace('bulk update', updates)
    this.log.debug('bulk update', updates.length)
    return this.store.bulkDocs<T>(updates)
  }

  byId(id: string): Promise<T & PouchDB.Core.RevisionIdMeta> {
    return this.store.get<T & PouchDB.Core.RevisionIdMeta>(id)
  }

  changes(): PouchDB.Core.Changes<T> {
    return this.store.changes()
  }

  async count(selector?: PouchDB.Find.FindRequest<T>): Promise<number> {
    const all = await this.all(selector)
    this.log.debug('count', all.length)
    return all.length
  }

  createDocument(document: DeepPartial<T>): T {
    const defaults = this.empty()
    return Merge<T>([defaults, document])
  }

  async delete(id: string, rev: string): Promise<PouchDB.Core.Response> {
    const response = await this.store.remove({ _id: id, _rev: rev })

    if (response.ok === false) {
      // this.log.error(response)
      throw new Error('could not delete ${response.id}')
    }

    return response
  }

  exists(id: string) {
    return this.store.exists(id, { meta__doctype: this.type })
  }

  async find(selector: PouchDB.Find.FindRequest<T>): Promise<Array<T & Meta>> {
    const defaults: PouchDB.Find.FindRequest<T> = { selector: { meta__doctype: this.type } }
    const query = Merge<PouchDB.Find.FindRequest<T>>([defaults, selector])
    this.log.debug('find', query)
    const results = await this.store.find(query)
    const docs: PouchDB.Core.ExistingDocument<T>[] = results.docs
    this.log.trace('find-results', results.docs.length)
    return docs
  }

  async getAttachment(id: string, rev: string, attachmentId: string) {
    try {
      const response = await this.store.getAttachment(id, attachmentId, { rev })
      this.log.trace(response)
      return response
    } catch (error) {
      this.log.error(error)
    }
  }

  async putAttachment(id: string, rev: string, attachmentId: string, type: string, buffer: Buffer) {
    try {
      const response = await this.store.putAttachment(id, attachmentId, rev, buffer, type)
      this.log.trace('create-attachment', response)
      return response
    } catch (error) {
      this.log.error(error)
    }
  }

  async keys(): Promise<string[]> {
    const keys = await this.all()
    return keys.map((key) => key._id)
  }

  query<Q>(fun: string | PouchDB.Map<T, Q> | PouchDB.Filter<T, Q>) {
    return this.store.query(fun)
  }

  live(config: CouchConfig) {
    const remote = new PouchDB(config.name, config)

    return this.store
      .sync(remote, { live: true, retry: true })
      .on('change', (change) => this.log.trace(change))
      .on('paused', (info) => this.log.trace('paused', info))
    // .on('error', (error) => this.log.error(error))
  }

  async update(updates: DeepPartial<T | (T & Meta)>): Promise<T & Meta> {
    const defaults = this.empty()
    const request = Merge<T>([defaults, updates])
    const id = request._id

    const response = await this.store.upsert<T>(id, (original) => {
      const merged = Merge<any>([original, request])
      this.log.trace('merge', original, request, merged)
      return merged
    })

    this.log.trace('upsert', updates, response)
    return this.store.get(response.id)
  }

  protected empty(): DeepPartial<T> {
    return { meta__doctype: this.type } as any
  }

  protected abstract get keyProperties(): string[]
}
