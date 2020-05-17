import { Express } from 'express'
import { Merge } from '@nnode/core'
import { Documents, Document } from '@nnode/core-data'

import { Route } from './Route'
import { pagination } from './PageModel'
import { createResponse, createResponseCollection } from './Response'

export abstract class ApiRoute extends Route {
  constructor(readonly name: string, router: Express) {
    super(router)
  }

  registerById<T extends Document>(route: string, context: Documents<T>) {
    this.router.get(this.clean(route), async (req, res) => {
      const { id } = req.params
      const movie = await context.byId(id)
      res.json(createResponse(movie))
    })
  }

  registerCollection<T extends Document>(route: string, context: Documents<T>) {
    this.router.get(this.clean(route), async (req, res) => {
      const { sort, query } = req.params
      const count = await context.count()
      const pagemodel = pagination(req, count)
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
        return res.status(400).send('invalid query')
      }

      try {
        const movies = await context.all(filter)
        res.json(createResponseCollection(movies, pagemodel))
      } catch (error) {}
    })
  }

  private clean(route: string): string {
    if (route.startsWith('/') === false) {
      return `/${route}`
    }

    return route
  }
}
