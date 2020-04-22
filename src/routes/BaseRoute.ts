import * as Router from 'koa-router'

export const BaseRoute = new Router()

BaseRoute.get('/ping', async (ctx: Router.IRouterContext) => {
  ctx.body = 'pong'
})
