import { Express, Handler, RequestHandler } from 'express'

import { RouteDefine } from './RouteDefine'

export class RouteVerb {
  constructor(private readonly owner: RouteDefine, private readonly route: string, private readonly router: Express) {}

  delete(handler: RequestHandler): RouteDefine {
    this.router.delete(this.route, handler)
    return this.owner
  }

  get(handler: RequestHandler): RouteDefine {
    this.router.get(this.route, handler)
    return this.owner
  }

  head(handler: RequestHandler): RouteDefine {
    this.router.head(this.route, handler)
    return this.owner
  }

  options(handler: RequestHandler): RouteDefine {
    this.router.options(this.route, handler)
    return this.owner
  }

  patch(handler: RequestHandler): RouteDefine {
    this.router.patch(this.route, handler)
    return this.owner
  }

  post(handler: RequestHandler): RouteDefine {
    this.router.post(this.route, handler)
    return this.owner
  }

  put(handler: RequestHandler): RouteDefine {
    this.router.put(this.route, handler)
    return this.owner
  }
}
