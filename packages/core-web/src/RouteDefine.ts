import { Express } from 'express'

import { RouteVerb } from './RouteVerb'

export class RouteDefine {
  constructor(private readonly type: string, private readonly router: Express) {}

  define(route: string): RouteVerb {
    return new RouteVerb(this, `${this.type}${route}`, this.router)
  }
}
