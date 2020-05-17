import path from 'path'

import { PATHS } from '.'
import { Document } from '../../src/Document'
import { Documents } from '../../src/Documents'
import { DocumentContext } from '../../src/DocumentContext'
import { CouchConfig } from '../../src/config/CouchConfig'
import { createLogger } from '@nnode/lincoln'

export interface EnvironmentVariable {
  name: string
  value: string
}

export interface EnvironmentVariableDocument extends Document, EnvironmentVariable {}

export interface User {
  home: string
  username: string
}

export interface UserDocument extends Document, User {}

export class TestContext extends DocumentContext<CouchConfig> {
  users: Users = new Users('user', this.store, createLogger('test'))
  variables: EnvironmentVariables = new EnvironmentVariables('env', this.store, createLogger('test'))

  protected createIndexDocuments() {
    return Promise.resolve()
  }
}

export class EnvironmentVariables extends Documents<EnvironmentVariableDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties(): string[] {
    return ['name']
  }
}

export class Users extends Documents<UserDocument> {
  readonly indexes: PouchDB.Find.CreateIndexOptions[] = []

  protected get keyProperties(): string[] {
    return ['username']
  }
}

export const DefaultTestContextConfig: CouchConfig = {
  adapter: 'memory',
  name: path.join(PATHS.cache(), 'users.db'),
}
