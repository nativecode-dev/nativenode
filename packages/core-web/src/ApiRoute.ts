import { Merge } from '@nnode/core'
import { Express } from 'express'
import { Documents, Document } from '@nnode/core-data'

import { Route } from './Route'
import { Pager } from './PageModel'
import { createResponse, createResponseCollection } from './Response'
import { RouteDefine } from './RouteDefine'

export abstract class ApiRoute extends Route {
  constructor(readonly name: string, router: Express) {
    super(router)
    this.register()
  }

  abstract register(): void

  protected registerById<T extends Document>(route: string, context: Documents<T>) {
    this.router.get(this.clean(route), async (req, res) => {
      const { id } = req.params
      const doc = await context.byId(id)
      res.json(createResponse(doc))
    })
  }

  protected registerCollection<T extends Document>(route: string, context: Documents<T>) {
    this.router.get(this.clean(route), async (req, res) => {
      const { sort, query } = req.params
      const count = await context.count()
      const pagemodel = Pager.pagination(req, count)
      const { skip, take } = pagemodel

      const filter: PouchDB.Find.FindRequest<T> = {
        skip,
        limit: take,
        selector: {},
        sort: sort ? sort.split(',') : undefined,
      }

      try {
        if (query) {
          const json = JSON.parse(query)
          filter.selector = Merge<PouchDB.Find.Selector>([filter.selector, json])
        }
      } catch (error) {
        console.error(error)
        return res.status(400).send('invalid query')
      }

      try {
        const docs = await context.all(filter)
        res.json(createResponseCollection(docs, pagemodel))
      } catch (error) {
        console.error(error)
      }
    })
  }

  private clean(route: string): string {
    if (route.startsWith('/') === false) {
      return `/${route}`
    }

    return route
  }

  protected routes(): RouteDefine {
    return new RouteDefine(this.name, this.router)
  }
}
