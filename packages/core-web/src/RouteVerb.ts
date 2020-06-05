import { Express, Handler } from 'express'

import { RouteDefine } from './RouteDefine'

export class RouteVerb {
  constructor(private readonly owner: RouteDefine, private readonly route: string, private readonly router: Express) {}

  delete(handler: Handler): RouteDefine {
    this.router.delete(this.route, handler)
    return this.owner
  }

  get(handler: Handler): RouteDefine {
    this.router.get(this.route, (req, res, next) => handler(req, res, next))
    return this.owner
  }

  head(handler: Handler): RouteDefine {
    this.router.head(this.route, (req, res, next) => handler(req, res, next))
    return this.owner
  }

  options(handler: Handler): RouteDefine {
    this.router.options(this.route, (req, res, next) => handler(req, res, next))
    return this.owner
  }

  post(handler: Handler): RouteDefine {
    this.router.post(this.route, (req, res, next) => handler(req, res, next))
    return this.owner
  }

  put(handler: Handler): RouteDefine {
    this.router.put(this.route, (req, res, next) => handler(req, res, next))
    return this.owner
  }
}
