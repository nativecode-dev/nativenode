import { Express, Handler, RequestHandler } from 'express'

import { RouteDefine } from './RouteDefine'

export class RouteVerb {
  constructor(private readonly owner: RouteDefine, private readonly route: string, private readonly router: Express) {}

  delete(...handlers: RequestHandler[]): RouteDefine {
    this.router.delete(this.route, handlers)
    return this.owner
  }

  get(...handlers: RequestHandler[]): RouteDefine {
    this.router.get(this.route, handlers)
    return this.owner
  }

  head(...handlers: RequestHandler[]): RouteDefine {
    this.router.head(this.route, handlers)
    return this.owner
  }

  options(...handlers: RequestHandler[]): RouteDefine {
    this.router.options(this.route, handlers)
    return this.owner
  }

  patch(...handlers: RequestHandler[]): RouteDefine {
    this.router.patch(this.route, handlers)
    return this.owner
  }

  post(...handlers: RequestHandler[]): RouteDefine {
    this.router.post(this.route, handlers)
    return this.owner
  }

  put(...handlers: RequestHandler[]): RouteDefine {
    this.router.put(this.route, handlers)
    return this.owner
  }
}
