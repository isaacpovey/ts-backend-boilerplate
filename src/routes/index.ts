import * as Router from 'koa-router'
import * as Compose from 'koa-compose'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import { BaseRoute } from './BaseRoute'



export const unLoggedRoutes = Compose([BaseRoute.routes(), BaseRoute.allowedMethods()])

const appRoute = new Router()

export function setLoggedRoutes(app: Koa) {
  appRoute.use(
    bodyParser()
  )
}
